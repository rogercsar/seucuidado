import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, MessageSquare, History } from 'lucide-react';

const mockAppointments = [
  {
    id: 1,
    chatId: 'chat_123',
    professional: 'Dr. Ana Silva',
    specialty: 'Cuidadora de Idosos',
    date: '25/11/2025',
    time: '14:00',
    status: 'Confirmado',
  },
];

export default function DashboardPage() {
  const { user, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se a sessão está sendo carregada, não faça nada ainda
    if (session === undefined) return;

    // Se não há usuário, redirecione para o login
    if (!user) {
      router.push('/login');
    }
  }, [user, session, router]);

  // Renderiza um estado de carregamento ou nulo enquanto redireciona
  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 className="font-poppins text-3xl font-bold text-dark-text dark:text-white mb-8">
        Meu Painel
      </h1>

      <div className="bg-white dark:bg-dark-bg/50 p-6 rounded-lg shadow-soft">
        <h2 className="font-poppins text-xl font-bold text-dark-text dark:text-white mb-4">
          Próximos Agendamentos
        </h2>
        <div className="space-y-4">
          {mockAppointments.map(appt => (
            <div key={appt.id} className="p-4 border dark:border-gray-700 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{appt.professional} - <span className="font-normal">{appt.specialty}</span></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> {appt.date}
                  <Clock className="ml-4 mr-2 h-4 w-4" /> {appt.time}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  appt.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appt.status}
                </span>
                <Button variant="ghost" size="icon" onClick={() => router.push(`/chat/${appt.chatId}`)}>
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="secondary">
            <History className="mr-2 h-4 w-4" /> Ver Histórico Completo
          </Button>
        </div>
      </div>
    </div>
  )
}
