"use client";
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { Heart, MapPin, Calendar, Check, X, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { logoutAndClearAuth } from '../../../lib/auth';

interface AppointmentItem {
  id: string;
  user_id: string;
  scheduled_at: string;
  status: 'requested' | 'scheduled' | 'completed' | 'canceled';
  price?: number;
  client_name?: string;
}

export default function ProDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [profileIncomplete, setProfileIncomplete] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }
        // localizar profissional vinculado ao usuário autenticado
        const { data: profs, error: profErr } = await supabase
          .from('professionals')
          .select('id, user_id, specialty, price_per_hour, city, radius_km, approved, documents')
          .eq('user_id', user.id)
          .limit(1);
        if (profErr) throw profErr;
        const prof = Array.isArray(profs) && profs.length > 0 ? profs[0] : null;
        if (!prof) {
          setError('Seu usuário não está vinculado a um perfil de profissional.');
          setLoading(false);
          return;
        }
        setProfessionalId(prof.id);
        const incomplete = !prof.specialty || prof.specialty === 'A definir' || !prof.city || !prof.price_per_hour || Number(prof.price_per_hour) <= 0 || prof.approved === false || !prof.documents;
        setProfileIncomplete(!!incomplete);
        // buscar appointments para este profissional
        const { data: apps, error: appsErr } = await supabase
          .from('appointments')
          .select('id, user_id, scheduled_at, status, price')
          .eq('professional_id', prof.id)
          .order('scheduled_at', { ascending: true });
        if (appsErr) throw appsErr;

        let items: AppointmentItem[] = (apps || []).map((a: any) => ({
          id: String(a.id),
          user_id: String(a.user_id),
          scheduled_at: a.scheduled_at,
          status: a.status,
          price: Number(a.price || 0),
        }));
        // buscar nomes dos clientes
        const userIds = Array.from(new Set(items.map(i => i.user_id).filter(Boolean)));
        if (userIds.length > 0) {
          const { data: users, error: usersErr } = await supabase
            .from('users')
            .select('id, name')
            .in('id', userIds as any);
          if (!usersErr && users) {
            const userMap = (users as any[]).reduce((acc, u) => { acc[u.id] = u.name; return acc; }, {} as Record<string, string>);
            items = items.map(i => ({ ...i, client_name: userMap[i.user_id] || 'Cliente' }));
          }
        }
        setAppointments(items);
      } catch (e) {
        setError('Falha ao carregar dados.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  async function handleLogout() {
    try {
      await logoutAndClearAuth();
    } finally {
      router.replace('/');
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }

  async function updateStatus(id: string, status: 'scheduled' | 'canceled' | 'completed') {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (e) {
      alert('Não foi possível atualizar o status.');
    }
  }

  const now = new Date();
  const requested = useMemo(() => appointments.filter(a => a.status === 'requested'), [appointments]);
  const scheduled = useMemo(() => appointments.filter(a => a.status === 'scheduled' && new Date(a.scheduled_at) >= now), [appointments]);
  const history = useMemo(() => appointments.filter(a => a.status === 'completed' || a.status === 'canceled' || new Date(a.scheduled_at) < now), [appointments]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-sky-50 to-emerald-50">
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent">Painel do Profissional</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard"><Button variant="ghost">Painel do Cliente</Button></Link>
            <Link href="/professionals"><Button variant="ghost">Descobrir</Button></Link>
            <Button className="rounded-full px-6 bg-red-500 hover:bg-red-600" onClick={handleLogout}>Sair</Button>
          </div>
        </div>
      </header>

      {profileIncomplete && (
        <div className="max-w-6xl mx-auto p-4">
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-500" />
            <div className="flex-1">
              <p className="font-semibold">Complete seu perfil profissional</p>
              <p className="text-sm">Adicione documentos, defina o raio de atendimento, especialidade, cidade e preço/hora para ficar visível e receber pedidos.</p>
            </div>
            <Link href="/pro/profile"><Button className="rounded-full bg-amber-500 hover:bg-amber-600">Completar perfil</Button></Link>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 py-8">
        {loading && (
          <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200">Carregando...</div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">{error}</div>
        )}
        {!loading && !error && professionalId && (
          <div className="grid md:grid-cols-3 gap-6">
            <section className="md:col-span-2 card p-6">
              <h3 className="font-poppins text-2xl mb-4">Meus Atendimentos</h3>
              <Tabs defaultValue="requested">
                <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
                  <TabsTrigger value="requested">Solicitações ({requested.length})</TabsTrigger>
                  <TabsTrigger value="scheduled">Agendados ({scheduled.length})</TabsTrigger>
                  <TabsTrigger value="history">Histórico ({history.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="requested" className="space-y-4">
                  {requested.length > 0 ? requested.map(r => (
                    <div key={r.id} className="border rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{r.client_name || 'Cliente'} — Solicitação</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(r.scheduled_at).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600" onClick={() => updateStatus(r.id, 'scheduled')}><Check className="w-4 h-4 mr-1" /> Aceitar</Button>
                        <Button className="rounded-full bg-red-500 hover:bg-red-600" onClick={() => updateStatus(r.id, 'canceled')}><X className="w-4 h-4 mr-1" /> Recusar</Button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">Nenhuma solicitação pendente</div>
                  )}
                </TabsContent>
                <TabsContent value="scheduled" className="space-y-4">
                  {scheduled.length > 0 ? scheduled.map(s => (
                    <div key={s.id} className="border rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{s.client_name || 'Cliente'} — Agendado</p>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(s.scheduled_at).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button className="rounded-full bg-sky-500 hover:bg-sky-600" onClick={() => updateStatus(s.id, 'completed')}><ClipboardCheck className="w-4 h-4 mr-1" /> Concluir</Button>
                        <Button className="rounded-full bg-red-500 hover:bg-red-600" onClick={() => updateStatus(s.id, 'canceled')}><X className="w-4 h-4 mr-1" /> Cancelar</Button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">Nenhum atendimento agendado</div>
                  )}
                </TabsContent>
                <TabsContent value="history" className="space-y-4">
                  {history.length > 0 ? history.map(h => (
                    <div key={h.id} className="border rounded-xl p-4 flex justify-between items-center opacity-75">
                      <div>
                        <p className="font-bold">{h.client_name || 'Cliente'} — {h.status === 'completed' ? 'Concluído' : 'Cancelado'}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1"><Calendar className="w-4 h-4" /> {new Date(h.scheduled_at).toLocaleString()}</div>
                      </div>
                      <div className="text-lg font-bold text-gray-600">R$ {(h.price || 0).toFixed(2)}</div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">Histórico vazio</div>
                  )}
                </TabsContent>
              </Tabs>
            </section>
            <aside className="space-y-4">
              <div className="card p-6">
                <h4 className="font-poppins text-lg mb-2">Status</h4>
                <p className="text-gray-700">Profissional vinculado: <span className="font-semibold">{professionalId}</span></p>
              </div>
              <div className="card p-6">
                <h4 className="font-poppins text-lg mb-2">Dicas</h4>
                <ul className="text-gray-700 text-sm list-disc ml-5 space-y-1">
                  <li>Aceite solicitações para confirmar o agendamento.</li>
                  <li>Use "Concluir" após realizar o atendimento.</li>
                  <li>Gerencie cancelamentos com responsabilidade.</li>
                </ul>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}