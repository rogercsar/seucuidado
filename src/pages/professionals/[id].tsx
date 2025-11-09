import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { Star, Calendar, Clock, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/AuthContext';

// Mock data for a single professional
const professional = {
  id: '123',
  name: 'Dr. Ana Silva',
  specialty: 'Cuidadora de Idosos',
  rating: 4.8,
  reviews: 125,
  imageUrl: 'https://i.pravatar.cc/300?img=1',
  pricePerHour: 75,
  bio: 'Cuidadora de idosos com mais de 10 anos de experiência, especializada em pacientes com Alzheimer e mobilidade reduzida. Ofereço um cuidado humano, com empatia e profissionalismo.',
  availability: {
    monday: '9:00 - 18:00',
    wednesday: '9:00 - 18:00',
    friday: '9:00 - 18:00',
  },
};

export default function ProfessionalProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSchedule = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/payment/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Atendimento com ${professional.name}`,
          unit_price: professional.pricePerHour,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment preference');
      }

      const data = await response.json();
      // Redirect to Mercado Pago checkout
      if (data.sandbox_init_point) {
        window.location.href = data.sandbox_init_point;
      }
    } catch (error) {
      console.error(error);
      alert('Ocorreu um erro ao iniciar o pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
      {/* Left Column: Profile Card */}
      <div className="md:col-span-1">
        <div className="bg-white dark:bg-dark-bg/50 p-6 rounded-lg shadow-soft text-center">
          <Image
            src={professional.imageUrl}
            alt={`Foto de ${professional.name}`}
            width={128}
            height={128}
            className="rounded-full mx-auto"
          />
          <h1 className="mt-4 font-poppins text-2xl font-bold text-dark-text dark:text-white">{professional.name}</h1>
          <p className="text-md text-gray-600 dark:text-gray-400">{professional.specialty}</p>
          <div className="flex justify-center items-center mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(professional.rating) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">{professional.rating.toFixed(1)} ({professional.reviews} avaliações)</span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-dark-text dark:text-dark-text-main">
              R${professional.pricePerHour.toFixed(2)}<span className="text-lg font-normal">/hora</span>
            </p>
          </div>
          <div className="mt-6 space-y-3">
            <Button className="w-full" size="lg" onClick={handleSchedule} disabled={isLoading}>
              <Calendar className="mr-2 h-5 w-5" />
              {isLoading ? 'Aguarde...' : 'Agendar Atendimento'}
            </Button>
            <Button className="w-full" variant="secondary" size="lg"><MessageSquare className="mr-2 h-5 w-5" />Enviar Mensagem</Button>
          </div>
        </div>
      </div>

      {/* Right Column: Details */}
      <div className="md:col-span-2">
        <div className="bg-white dark:bg-dark-bg/50 p-6 rounded-lg shadow-soft">
          <h2 className="font-poppins text-xl font-bold text-dark-text dark:text-white">Sobre mim</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{professional.bio}</p>

          <h2 className="mt-6 font-poppins text-xl font-bold text-dark-text dark:text-white">Disponibilidade</h2>
          <ul className="mt-2 space-y-2 text-gray-700 dark:text-gray-300">
            {Object.entries(professional.availability).map(([day, time]) => (
              <li key={day} className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-primary" />
                <span className="capitalize font-semibold w-24">{day}:</span>
                <span>{time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
