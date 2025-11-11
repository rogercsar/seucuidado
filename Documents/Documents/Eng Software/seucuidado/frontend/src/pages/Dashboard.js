import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MessageCircle, Heart, LogOut, User, Clock, CheckCircle, XCircle, MapPin } from "lucide-react";
import { api } from "@/App";
import { toast } from "sonner";

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments");
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Erro ao carregar agendamentos");
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await api.patch(`/appointments/${appointmentId}?status=${status}`);
      toast.success("✓ Status atualizado!");
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700"
    };
    
    const labels = {
      pending: "Pendente",
      confirmed: "Confirmado",
      completed: "Concluído",
      cancelled: "Cancelado"
    };

    return (
      <Badge className={`${styles[status]} border-0`}>
        {labels[status]}
      </Badge>
    );
  };

  const upcomingAppointments = appointments.filter(a => 
    a.status === "pending" || a.status === "confirmed"
  );
  
  const pastAppointments = appointments.filter(a => 
    a.status === "completed" || a.status === "cancelled"
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <Heart className="w-8 h-8 text-sky-400 fill-sky-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent">
              SeuCuidado
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              data-testid="home-button" 
              variant="ghost"
              onClick={() => navigate("/")}
            >
              Início
            </Button>
            <Button
              data-testid="professionals-button" 
              variant="ghost"
              onClick={() => navigate("/professionals")}
            >
              Profissionais
            </Button>
            <Button
              data-testid="logout-button" 
              variant="ghost"
              onClick={onLogout}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User Info */}
        <Card className="mb-8 rounded-2xl shadow-xl border-2 border-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 ring-8 ring-sky-100">
                <AvatarImage src={user.picture} />
                <AvatarFallback><User className="w-12 h-12" /></AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
                <p className="text-gray-600 mb-3">{user.email}</p>
                <Badge className="bg-gradient-to-r from-sky-100 to-emerald-100 text-sky-700 border-0">
                  {user.user_type === "patient" ? "Paciente" : "Profissional"}
                </Badge>
              </div>

              <div className="text-right space-y-2">
                <div className="text-sm text-gray-600">Agendamentos</div>
                <div className="text-4xl font-bold text-sky-500">{upcomingAppointments.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-xl transition rounded-2xl border-2 border-sky-100 hover:border-sky-300"
            onClick={() => navigate("/professionals")}
            data-testid="find-professionals-card"
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto">
                <User className="w-7 h-7 text-sky-600" />
              </div>
              <h3 className="font-bold text-lg">Encontrar Profissional</h3>
              <p className="text-sm text-gray-600">Busque especialistas próximos</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 border-emerald-100 shadow-lg">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg">Próximos Atendimentos</h3>
              <p className="text-sm text-gray-600">{upcomingAppointments.length} agendado(s)</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 border-purple-100 shadow-lg">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto">
                <MessageCircle className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg">Mensagens</h3>
              <p className="text-sm text-gray-600">Chat com profissionais</p>
            </CardContent>
          </Card>
        </div>

        {/* Appointments */}
        <Card className="rounded-2xl shadow-xl border-2 border-white">
          <CardHeader>
            <CardTitle className="text-2xl">Meus Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                <TabsTrigger value="upcoming" data-testid="upcoming-tab">Próximos ({upcomingAppointments.length})</TabsTrigger>
                <TabsTrigger value="past" data-testid="past-tab">Histórico ({pastAppointments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((apt) => (
                    <Card key={apt.id} className="rounded-xl border-2 border-gray-100">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg">Atendimento Agendado</h3>
                              {getStatusBadge(apt.status)}
                            </div>
                            
                            <div className="space-y-2 text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(apt.date).toLocaleString('pt-BR')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{apt.duration_hours} hora(s)</span>
                              </div>
                              {apt.notes && (
                                <p className="text-sm mt-2 p-3 bg-gray-50 rounded-lg">
                                  <strong>Observações:</strong> {apt.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-sky-600 mb-2">
                              R$ {apt.total_price.toFixed(2)}
                            </div>
                            
                            {user.user_type === "professional" && apt.status === "pending" && (
                              <div className="space-y-2">
                                <Button
                                  data-testid={`confirm-appointment-${apt.id}`}
                                  size="sm"
                                  onClick={() => updateAppointmentStatus(apt.id, "confirmed")}
                                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Confirmar
                                </Button>
                                <Button
                                  data-testid={`cancel-appointment-${apt.id}`}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateAppointmentStatus(apt.id, "cancelled")}
                                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Recusar
                                </Button>
                              </div>
                            )}
                            
                            {apt.status === "confirmed" && (
                              <Button
                                data-testid={`complete-appointment-${apt.id}`}
                                size="sm"
                                onClick={() => updateAppointmentStatus(apt.id, "completed")}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                Concluir
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Nenhum agendamento próximo</p>
                    <Button
                      data-testid="find-professionals-empty-button" 
                      onClick={() => navigate("/professionals")}
                      className="mt-4 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white rounded-full"
                    >
                      Encontrar Profissional
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastAppointments.length > 0 ? (
                  pastAppointments.map((apt) => (
                    <Card key={apt.id} className="rounded-xl border-2 border-gray-100 opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg">Atendimento</h3>
                              {getStatusBadge(apt.status)}
                            </div>
                            
                            <div className="space-y-2 text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(apt.date).toLocaleString('pt-BR')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{apt.duration_hours} hora(s)</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-600">
                              R$ {apt.total_price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>Nenhum atendimento anterior</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;