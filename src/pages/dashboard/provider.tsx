import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Briefcase, Calendar, MessageSquare, DollarSign } from 'lucide-react';

export default function ProviderDashboardPage() {
  const { user, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session === undefined) return; // Aguardando carregamento da sessão
    if (!user) {
      router.push('/login');
    }
  }, [user, session, router]);

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h1 className="font-poppins text-3xl font-bold text-dark-text dark:text-white mb-8">
        Painel do Profissional
      </h1>

      <div className="bg-white dark:bg-dark-bg/50 p-6 rounded-lg shadow-soft">
        <h2 className="font-poppins text-xl font-bold text-dark-text dark:text-white mb-4">
          Minhas Atividades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 border dark:border-gray-700 rounded-lg">
            <Briefcase className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="font-semibold">0 Novas Solicitações</p>
          </div>
          <div className="p-4 border dark:border-gray-700 rounded-lg">
            <Calendar className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="font-semibold">0 Agendamentos Futuros</p>
          </div>
          <div className="p-4 border dark:border-gray-700 rounded-lg">
            <DollarSign className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="font-semibold">R$ 0,00 Saldo a Receber</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Button variant="secondary">
            <MessageSquare className="mr-2 h-4 w-4" /> Ver Minhas Mensagens
          </Button>
        </div>
      </div>
    </div>
  )
}
