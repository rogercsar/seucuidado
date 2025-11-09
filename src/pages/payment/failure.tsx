import { Button } from '@/components/ui/Button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailurePage() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-20">
            <XCircle className="text-red-500 w-24 h-24 mb-6" />
            <h1 className="font-poppins text-3xl font-bold text-dark-text dark:text-white">
                Pagamento Recusado
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Ocorreu um problema ao processar seu pagamento. Por favor, tente novamente.
            </p>
            <div className="mt-8">
                <Link href="/">
                    <Button variant="secondary">Voltar para a Home</Button>
                </Link>
            </div>
        </div>
    );
}
