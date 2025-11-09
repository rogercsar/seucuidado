import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPendingPage() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <AlertCircle className="text-yellow-500 w-24 h-24 mb-6" />
            <h1 className="font-poppins text-3xl font-bold text-dark-text dark:text-white">
                Pagamento Pendente
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Seu pagamento está sendo processado. Avisaremos assim que for aprovado.
            </p>
            <div className="mt-8">
                <Link href="/dashboard">
                    <Button>Ver Meus Agendamentos</Button>
                </Link>
            </div>
        </div>
    );
}
