import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Heart, ArrowLeft } from "lucide-react";
import { api } from "@/App";

const ProfessionalsPage = ({ user }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    fetchProfessionals();
  }, []);

  useEffect(() => {
    filterProfessionals();
  }, [professionals, searchTerm, specialtyFilter, cityFilter]);

  const fetchProfessionals = async () => {
    try {
      const response = await api.get("/professionals");
      setProfessionals(response.data);
    } catch (error) {
      console.error("Error fetching professionals:", error);
    }
  };

  const filterProfessionals = () => {
    let filtered = [...professionals];

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialtyFilter !== "all") {
      filtered = filtered.filter(p => p.specialty === specialtyFilter);
    }

    if (cityFilter !== "all") {
      filtered = filtered.filter(p => p.location.city === cityFilter);
    }

    setFilteredProfessionals(filtered);
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

  const cities = [...new Set(professionals.map(p => p.location.city))];

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
              onClick={() => navigate("/")}
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
          
          {user && (
            <Button
              data-testid="dashboard-button" 
              onClick={() => navigate("/dashboard")} 
              className="bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white rounded-full px-6"
            >
              Meu Painel
            </Button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Profissionais Disponíveis</h1>
          <p className="text-gray-600">Encontre o profissional ideal para suas necessidades</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid md:grid-cols-4 gap-4">
            <Input
              data-testid="search-input"
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 rounded-xl border-2 border-gray-100 focus:border-sky-400"
            />
            
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger data-testid="specialty-filter" className="h-12 rounded-xl border-2 border-gray-100">
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as especialidades</SelectItem>
                <SelectItem value="nurse">Enfermeiro(a)</SelectItem>
                <SelectItem value="physiotherapist">Fisioterapeuta</SelectItem>
                <SelectItem value="companion">Cuidador(a)</SelectItem>
                <SelectItem value="home_care">Home Care</SelectItem>
              </SelectContent>
            </Select>

            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger data-testid="city-filter" className="h-12 rounded-xl border-2 border-gray-100">
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              data-testid="clear-filters-button" 
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSpecialtyFilter("all");
                setCityFilter("all");
              }}
              className="h-12 rounded-xl border-2 border-gray-200 hover:bg-gray-50"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold text-sky-600">{filteredProfessionals.length}</span> profissionais encontrados
          </p>
        </div>

        {/* Professionals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((prof) => (
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

                <p className="text-sm text-gray-600 line-clamp-3">{prof.bio}</p>

                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between">
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

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experiência:</span>
                    <span className="font-semibold">{prof.experience_years} anos</span>
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

        {filteredProfessionals.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum profissional encontrado com esses filtros.</p>
            <Button
              data-testid="clear-all-filters-button" 
              onClick={() => {
                setSearchTerm("");
                setSpecialtyFilter("all");
                setCityFilter("all");
              }}
              className="mt-4 bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white rounded-full"
            >
              Limpar todos os filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalsPage;