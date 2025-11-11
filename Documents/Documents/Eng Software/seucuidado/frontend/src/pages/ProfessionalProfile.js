import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Star, Calendar, MessageCircle, Clock, Award, Heart, ArrowLeft, CheckCircle } from "lucide-react";
import { api } from "@/App";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

const ProfessionalProfile = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchProfessional();
    fetchReviews();
  }, [id]);

  const fetchProfessional = async () => {
    try {
      const response = await api.get(`/professionals/${id}`);
      setProfessional(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching professional:", error);
      toast.error("Erro ao carregar profissional");
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSchedule = async () => {
    if (!user) {
      toast.error("Faça login para agendar");
      const redirectUrl = encodeURIComponent(window.location.origin + "/dashboard");
      window.location.href = `https://auth.emergentagent.com/?redirect=${redirectUrl}`;
      return;
    }

    if (!appointmentDate) {
      toast.error("Selecione uma data");
      return;
    }

    try {
      await api.post("/appointments", {
        professional_id: id,
        date: new Date(appointmentDate).toISOString(),
        duration_hours: 1,
        total_price: professional.price_per_hour,
        notes: appointmentNotes,
        status: "pending"
      });
      
      toast.success("✓ Solicitação de agendamento enviada!");
      setDialogOpen(false);
      setAppointmentDate("");
      setAppointmentNotes("");
      
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erro ao agendar");
    }
  };

  const handleChat = () => {
    if (!user) {
      toast.error("Faça login para conversar");
      return;
    }
    navigate(`/chat/${professional.user_id}`);
  };

  const getSpecialtyLabel = (specialty) => {
    const labels = {
      nurse: "Enfermeiro(a)",
      physiotherapist: "Fisioterapeuta",
      companion: "Cuidador(a)",
      home_care: "Home Care"
    };
    return labels[specialty] || specialty;
  };

  const getDayLabel = (day) => {
    const labels = {
      monday: "Seg",
      tuesday: "Ter",
      wednesday: "Qua",
      thursday: "Qui",
      friday: "Sex",
      saturday: "Sáb",
      sunday: "Dom"
    };
    return labels[day] || day;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-400"></div>
      </div>
    );
  }

  if (!professional) {
    return <div>Profissional não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              data-testid="back-button"
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-sky-400 fill-sky-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent">
                SeuCuidado
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl shadow-xl border-2 border-white">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <Avatar className="w-32 h-32 ring-8 ring-sky-100">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${professional.id.slice(-1)}`} />
                    <AvatarFallback>{professional.bio.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">Profissional Qualificado</h1>
                        {professional.verified && (
                          <Badge className="bg-emerald-100 text-emerald-600 border-0">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-sky-100 text-sky-600 border-0 text-base px-3 py-1">
                        {getSpecialtyLabel(professional.specialty)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-lg">{professional.rating.toFixed(1)}</span>
                        <span className="text-sm">({professional.total_reviews} avaliações)</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin className="w-5 h-5 text-emerald-500" />
                        <span>{professional.location.city}, {professional.location.state}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-5 h-5 text-purple-500" />
                      <span>{professional.experience_years} anos de experiência</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Sobre</h2>
                  <p className="text-gray-600 leading-relaxed">{professional.bio}</p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Disponibilidade</h2>
                  <div className="flex flex-wrap gap-2">
                    {professional.availability.map((day) => (
                      <Badge key={day} className="bg-gradient-to-r from-sky-100 to-emerald-100 text-sky-700 border-0 px-4 py-2">
                        {getDayLabel(day)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="rounded-2xl shadow-xl border-2 border-white">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Avaliações</h2>
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Nenhuma avaliação ainda</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="rounded-2xl shadow-xl border-2 border-white sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent mb-2">
                    R$ {professional.price_per_hour.toFixed(0)}
                  </div>
                  <div className="text-gray-500">por hora</div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        data-testid="schedule-button" 
                        className="w-full bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white h-12 rounded-xl text-base font-semibold"
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Agendar Atendimento
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Agendar Atendimento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Data e Hora</Label>
                          <Input
                            data-testid="appointment-date-input"
                            type="datetime-local"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="rounded-xl"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Observações (opcional)</Label>
                          <Textarea
                            data-testid="appointment-notes-textarea"
                            value={appointmentNotes}
                            onChange={(e) => setAppointmentNotes(e.target.value)}
                            placeholder="Descreva suas necessidades..."
                            className="rounded-xl"
                            rows={4}
                          />
                        </div>

                        <div className="bg-sky-50 p-4 rounded-xl">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total (1 hora):</span>
                            <span className="text-2xl font-bold text-sky-600">
                              R$ {professional.price_per_hour.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <Button
                          data-testid="confirm-schedule-button" 
                          onClick={handleSchedule}
                          className="w-full bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white h-12 rounded-xl"
                        >
                          Confirmar Agendamento
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    data-testid="chat-button" 
                    onClick={handleChat}
                    variant="outline"
                    className="w-full h-12 rounded-xl border-2 border-sky-200 hover:bg-sky-50"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Conversar
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Resposta em até 24h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Pagamento seguro</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;