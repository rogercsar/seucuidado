"use client";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockProfessionals } from '../../../lib/utils';
import { SchedulePicker } from '../../../components/ui/SchedulePicker';
import { useState, useEffect } from 'react';
import { PaymentModal } from '../../../components/ui/PaymentModal';
import { Heart, MapPin, Star } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfessionalProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [p, setP] = useState(() => mockProfessionals.find(x => x.id === id));
  const [slot, setSlot] = useState<string | undefined>(p?.availability?.[0]);
  const [creating, setCreating] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const router = useRouter();

  if (!p) return <main className="max-w-4xl mx-auto p-4">Profissional não encontrado.</main>;

  async function confirmAppointment() {
    if (!slot) {
      alert('Escolha um horário.');
      return;
    }
    // Converter 'HH:mm' para próximo Date
    const [hh, mm] = slot.split(':').map((v) => parseInt(v, 10));
    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(hh || 9, mm || 0, 0, 0);
    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }
    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Faça login para agendar.');
        return;
      }
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          professional_id: id,
          scheduled_at: scheduled.toISOString(),
          status: 'requested',
          price: p?.pricePerHour || 0,
        })
        .select('id')
        .single();
      if (error) throw error;
      setAppointmentId(data.id);
      setShowPayment(true);
    } catch (e: any) {
      alert('Falha ao criar agendamento: ' + (e.message || ''));
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full">
              <div className="relative">
                <Heart className="w-8 h-8 text-sky-400" />
                <MapPin className="w-4 h-4 text-emerald-400 absolute -bottom-1 -right-1" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent">SeuCuidado</h1>
          </div>
          <Link href="/dashboard" className="rounded-full px-6 py-2 bg-sky-400 text-white">Meu Painel</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-3 gap-6">
        {/* Perfil principal */}
        <section className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img src={p.photoUrl} alt={p.name} className="w-32 h-32 rounded-xl object-cover" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-poppins text-3xl font-semibold">{p.name}</h2>
                </div>
                <p className="text-textblue/80">{p.specialty} • {p.city}</p>
                <div className="flex items-center gap-2 text-gray-700">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">{p.rating.toFixed(1)}</span>
                </div>
                <p className="mt-1">Preço/hora: R$ {p.pricePerHour}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700 leading-relaxed">{p.bio}</p>
          </div>

          <div className="card p-6">
            <h3 className="font-poppins text-lg mb-2">Escolha um horário</h3>
            {p.availability && <SchedulePicker availability={p.availability} selected={slot} onSelect={setSlot} />}
            <div className="mt-4 flex justify-end gap-2">
              <button className="btn-gradient text-white px-4 py-2 rounded-xl" onClick={confirmAppointment} disabled={creating}>{creating ? 'Criando...' : 'Confirmar agendamento'}</button>
              {showPayment && appointmentId && (
                <PaymentModal 
                  amount={p.pricePerHour} 
                  description={`Atendimento com ${p.name} — ${slot || ''}`} 
                  appointmentId={appointmentId}
                />
              )}
            </div>
          </div>
        </section>

        {/* Painel lateral / info adicional */}
        <aside className="space-y-4">
          <div className="card p-6">
            <h4 className="font-poppins text-lg mb-2">Disponibilidade</h4>
            <div className="flex flex-wrap gap-2">
              {(p.availability || []).map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm">{t}</span>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h4 className="font-poppins text-lg mb-2">Localização</h4>
            <p className="text-gray-700">{p.city}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}