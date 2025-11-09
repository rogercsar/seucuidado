import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const { collection_id, status, payment_id, preference_id } = router.query;

    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <CheckCircle className="text-green-500 w-24 h-24 mb-6" />
            <h1 className="font-poppins text-3xl font-bold text-dark-text dark:text-white">
                Pagamento Aprovado!
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Seu agendamento foi confirmado com sucesso.
            </p>
            <div className="mt-4 text-sm text-gray-500">
                <p>Status: {status}</p>
                <p>ID do Pagamento: {payment_id}</p>
            </div>
            <div className="mt-8">
                <Link href="/dashboard">
                    <Button>Ir para Meus Agendamentos</Button>
                </Link>
            </div>
        </div>
    );
}
