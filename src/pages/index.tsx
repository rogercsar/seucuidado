import ProfessionalCard from '@/components/ProfessionalCard';
import { Button } from '@/components/ui/Button';
import { Search } from 'lucide-react';

const mockProfessionals = [
  {
    name: 'Dr. Ana Silva',
    specialty: 'Cuidadora de Idosos',
    rating: 4.8,
    imageUrl: 'https://i.pravatar.cc/300?img=1',
    pricePerHour: 75,
  },
  {
    name: 'Carlos Lima',
    specialty: 'Enfermeiro',
    rating: 4.9,
    imageUrl: 'https://i.pravatar.cc/300?img=2',
    pricePerHour: 90,
  },
  {
    name: 'Juliana Costa',
    specialty: 'Fisioterapeuta',
    rating: 4.7,
    imageUrl: 'https://i.pravatar.cc/300?img=3',
    pricePerHour: 120,
  },
    {
    name: 'Lucas Martins',
    specialty: 'Acompanhante Hospitalar',
    rating: 5.0,
    imageUrl: 'https://i.pravatar.cc/300?img=4',
    pricePerHour: 60,
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="font-poppins text-4xl md:text-6xl font-bold text-dark-text dark:text-white">
          Conectando você ao <span className="text-primary">cuidado certo</span>.
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Encontre profissionais de saúde para atendimento domiciliar com segurança e confiança.
        </p>
        <div className="mt-8 max-w-xl mx-auto flex items-center bg-white dark:bg-dark-bg/50 p-2 rounded-lg shadow-soft">
          <input
            type="text"
            placeholder="Busque por especialidade ou cidade..."
            className="w-full bg-transparent p-2 focus:outline-none"
          />
          <Button>
            <Search className="h-5 w-5 mr-2" />
            Buscar
          </Button>
        </div>
      </section>

      {/* Professionals Section */}
      <section className="py-16">
        <h2 className="font-poppins text-3xl font-bold text-center text-dark-text dark:text-white mb-10">
          Profissionais em destaque
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {mockProfessionals.map((prof, index) => (
            <ProfessionalCard key={index} {...prof} />
          ))}
        </div>
      </section>
    </>
  )
}
