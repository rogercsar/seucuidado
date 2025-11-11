import React, { useState } from 'react';
import { Button } from './Button';

async function createPreference(amount: number, description: string, appointmentId: string) {
  const res = await fetch('/api/mercadopago/create_preference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, description, appointment_id: appointmentId }),
  });
  if (!res.ok) throw new Error('Erro ao criar preferência');
  return res.json();
}

export const PaymentModal: React.FC<{ amount: number; description: string; appointmentId: string }> = ({ amount, description, appointmentId }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    try {
      const pref = await createPreference(amount, description, appointmentId);
      // Redirecionar para callback de sucesso após pagamento
      const callbackUrl = `${window.location.origin}/api/payment/success?appointment_id=${appointmentId}`;
      // Se o Mercado Pago suportar redirect_url, usaríamos:
      // window.location.href = `${pref.init_point}&redirect_url=${encodeURIComponent(callbackUrl)}`;
      // Por enquanto, redirecionar direto e atualizar via webhook ou manual
      window.location.href = pref.init_point;
      // Após pagamento, o usuário deve ser redirecionado para callback (manual por enquanto)
    } catch (e) {
      alert('Falha no pagamento');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return <Button onClick={() => setOpen(true)}>Pagar</Button>;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="card p-4 w-full max-w-md">
        <h3 className="font-poppins text-lg mb-2">Confirmar pagamento</h3>
        <p className="mb-3">Valor: R$ {amount.toFixed(2)}</p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={pay} disabled={loading}>{loading ? 'Processando...' : 'Pagar agora'}</Button>
        </div>
      </div>
    </div>
  );
};