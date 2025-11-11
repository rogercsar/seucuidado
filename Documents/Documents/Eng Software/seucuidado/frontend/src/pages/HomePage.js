import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Heart, Users, Shield, Clock } from "lucide-react";
import { api } from "@/App";

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      const response = await api.get("/professionals");
      setProfessionals(response.data);
    } catch (error) {
      console.error("Error fetching professionals:", error);
    }
  };

  const handleLogin = () => {
    const redirectUrl = encodeURIComponent(window.location.origin + "/dashboard");
    window.location.href = `https://auth.emergentagent.com/?redirect=${redirectUrl}`;
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Heart className="w-8 h-8 text-sky-400 fill-sky-400" />
              <MapPin className="w-4 h-4 text-emerald-400 absolute -bottom-1 -right-1" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent">
              SeuCuidado
            </h1>
          </div>
          
          {user ? (
            <Button 
              data-testid="dashboard-button"
              onClick={() => navigate("/dashboard")} 
              className="bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white rounded-full px-6"
            >
              Meu Painel
            </Button>
          ) : (
            <Button 
              data-testid="login-button"
              onClick={handleLogin} 
              className="bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white rounded-full px-6"
            >
              Entrar
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-sky-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Badge className="bg-sky-100 text-sky-600 hover:bg-sky-100 border-0 px-4 py-1">
              Conectando você ao cuidado certo
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Encontre o profissional certo para cuidar de{" "}
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                quem você ama
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Com poucos cliques, mais segurança e carinho no seu lar.
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  data-testid="search-input"
                  type="text"
                  placeholder="Buscar profissional ou especialidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 h-12 px-4 rounded-xl border-2 border-gray-100 focus:border-sky-400 transition"
                />
                <Button 
                  data-testid="search-button"
                  onClick={() => navigate(`/professionals?search=${searchTerm}`)}
                  className="bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white rounded-xl px-8 h-12"
                >
                  Buscar
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-500">500+</div>
                <div className="text-sm text-gray-600">Profissionais</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-500">2.5k+</div>
                <div className="text-sm text-gray-600">Atendimentos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">4.9</div>
                <div className="text-sm text-gray-600">Avaliação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Por que escolher o SeuCuidado?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-sky-100 hover:border-sky-300 transition shadow-lg hover:shadow-xl rounded-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-sky-500" />
                </div>
                <h3 className="text-xl font-bold">Profissionais Verificados</h3>
                <p className="text-gray-600">
                  Todos os profissionais passam por verificação de documentos e histórico.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-100 hover:border-emerald-300 transition shadow-lg hover:shadow-xl rounded-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold">Atendimento Humanizado</h3>
                <p className="text-gray-600">
                  Profissionais capacitados e com foco no cuidado empático.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 hover:border-purple-300 transition shadow-lg hover:shadow-xl rounded-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto">
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold">Agendamento Rápido</h3>
                <p className="text-gray-600">
                  Agende atendimentos em poucos minutos direto pela plataforma.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Professionals */}
      <section className="py-16 bg-gradient-to-br from-sky-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Profissionais em destaque</h2>
            <p className="text-gray-600">Conheça alguns dos nossos melhores profissionais</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {professionals.slice(0, 3).map((prof) => (
              <Card 
                key={prof.id} 
                className="hover:shadow-2xl transition cursor-pointer border-2 border-transparent hover:border-sky-200 rounded-2xl overflow-hidden"
                onClick={() => navigate(`/professional/${prof.id}`)}
                data-testid={`professional-card-${prof.id}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 ring-4 ring-sky-100">
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${prof.id.slice(-1)}`} />
                      <AvatarFallback>{prof.bio.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">Profissional</h3>
                        {prof.verified && (
                          <Badge className="bg-emerald-100 text-emerald-600 border-0 text-xs">
                            ✓ Verificado
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-sky-100 text-sky-600 border-0">
                        {getSpecialtyLabel(prof.specialty)}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{prof.bio}</p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{prof.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({prof.total_reviews})</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-emerald-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">{prof.location.city}</span>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <span className="text-2xl font-bold text-sky-500">
                      R$ {prof.price_per_hour.toFixed(0)}
                    </span>
                    <span className="text-gray-500 text-sm">/hora</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              data-testid="view-all-professionals-button" 
              onClick={() => navigate("/professionals")}
              className="bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white rounded-full px-8"
            >
              Ver todos os profissionais
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-sky-400 fill-sky-400" />
                <h3 className="text-xl font-bold">SeuCuidado</h3>
              </div>
              <p className="text-gray-400">
                Conectando você ao cuidado certo.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition">Como funciona</a></li>
                <li><a href="#" className="hover:text-white transition">Profissionais</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contato@seucuidado.com</li>
                <li>(11) 9999-9999</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SeuCuidado. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;