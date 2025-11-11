"use client";
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { Heart, MapPin, User, Calendar, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/Tabs';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import { logoutAndClearAuth } from '../../lib/auth';

interface AppointmentWithProfessional {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  price: number;
  avatar: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email?: string; picture?: string }>({ name: 'Usuário' });
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentWithProfessional[]>([]);
  const [loading, setLoading] = useState(true);

  // Mostrar mensagem de sucesso após criação de appointment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === '1') {
      alert('Appointment criado com sucesso!');
      // Remover o parâmetro da URL para não mostrar novamente ao recarregar
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    if (params.get('payment_success') === '1') {
      alert('Pagamento confirmado! Seu appointment foi agendado.');
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    if (params.get('payment_error') === '1') {
      alert('Erro ao processar pagamento. Tente novamente.');
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser({
            name: (authUser.user_metadata as any)?.name || authUser.email || 'Usuário',
            email: authUser.email || '',
            picture: 'https://i.pravatar.cc/150?u=' + authUser.id,
          });
          const { data, error } = await supabase
            .from('appointments')
            .select('id, scheduled_at, status, price, professional_id')
            .eq('user_id', authUser.id)
            .order('scheduled_at', { ascending: true });
          if (!error && data) {
            // Buscar dados dos profissionais relacionados
            const profIds = Array.from(new Set((data as any[]).map(a => a.professional_id).filter(Boolean)));
            let profMap: Record<string, { city?: string; specialty?: string; user_id?: string }> = {};
            let userMap: Record<string, { name?: string }> = {};
            if (profIds.length > 0) {
              const { data: profs, error: profErr } = await supabase
                .from('professionals')
                .select('id, user_id, city, specialty')
                .in('id', profIds as any);
              if (!profErr && profs) {
                profMap = (profs as any[]).reduce((acc, p) => {
                  acc[p.id] = { city: p.city, specialty: p.specialty, user_id: p.user_id };
                  return acc;
                }, {} as Record<string, { city?: string; specialty?: string; user_id?: string }>);
                const userIds = Array.from(new Set((profs as any[]).map(p => p.user_id).filter(Boolean)));
                if (userIds.length > 0) {
                  const { data: users, error: usersErr } = await supabase
                    .from('users')
                    .select('id, name')
                    .in('id', userIds as any);
                  if (!usersErr && users) {
                    userMap = (users as any[]).reduce((acc, u) => {
                      acc[u.id] = { name: u.name };
                      return acc;
                    }, {} as Record<string, { name?: string }>);
                  }
                }
              }
            }
  
            const now = new Date();
            const up = (data as any[])
              .filter((a: any) => a.status !== 'completed' && a.status !== 'canceled' && new Date(a.scheduled_at) >= now)
              .map((a: any) => {
                const prof = profMap[a.professional_id] || {};
                const name = prof.user_id ? userMap[prof.user_id]?.name : undefined;
                const specialty = prof.specialty;
                const city = prof.city;
                const avatar = prof.user_id ? `https://i.pravatar.cc/100?u=${prof.user_id}` : `https://i.pravatar.cc/100?u=${a.professional_id}`;
                return {
                  id: a.id,
                  title: `${name || 'Profissional'}${specialty ? ' — ' + specialty : ''}`,
                  subtitle: city || '',
                  date: new Date(a.scheduled_at).toLocaleString(),
                  price: Number(a.price || 0),
                  avatar,
                };
              });
            const hist = (data as any[])
              .filter((a: any) => a.status === 'completed' || new Date(a.scheduled_at) < now)
              .map((a: any) => {
                const prof = profMap[a.professional_id] || {};
                const name = prof.user_id ? userMap[prof.user_id]?.name : undefined;
                const specialty = prof.specialty;
                const city = prof.city;
                const avatar = prof.user_id ? `https://i.pravatar.cc/100?u=${prof.user_id}` : `https://i.pravatar.cc/100?u=${a.professional_id}`;
                return {
                  id: a.id,
                  title: `${name || 'Profissional'}${specialty ? ' — ' + specialty : ''}`,
                  subtitle: city || '',
                  date: new Date(a.scheduled_at).toLocaleString(),
                  price: Number(a.price || 0),
                  avatar,
                };
              });
            setUpcoming(up);
            setHistory(hist);
          }
        } else {
          // Se não autenticado, redireciona para a página de autenticação
          router.push('/auth');
          return;
        }
      } catch (e) {
        // Se houver erro ao recuperar sessão, redireciona para autenticação
        router.push('/auth');
        return;
      }
    }
    load();
  }, []);

  async function handleLogout() {
    try {
      await logoutAndClearAuth();
    } finally {
      router.push('/');
    }
  }

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-emerald-400 bg-clip-text text-transparent">SeuCuidado</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/professionals"><Button variant="ghost">Profissionais</Button></Link>
            <Button className="rounded-full px-6 bg-red-500 hover:bg-red-600" onClick={handleLogout}>Sair</Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Mensagem de sucesso */}
        {showSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-3">
            <span className="text-emerald-500">✅</span>
            <span>Agendamento criado com sucesso!</span>
          </div>
        )}

        {/* User Info */}
        <div className="card p-6 mb-8 flex items-center gap-6">
          <img src={user.picture || 'https://i.pravatar.cc/150?u=default'} alt="User" className="w-24 h-24 rounded-full ring-4 ring-sky-100" />
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-1">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Agendamentos</div>
            <div className="text-4xl font-bold text-sky-500">{upcoming.length}</div>
          </div>
        </div>

        {/* Appointments */}
        <div className="card p-6">
          <h3 className="font-poppins text-2xl mb-4">Meus Agendamentos</h3>
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">Próximos ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="past">Histórico ({history.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-4">
              {upcoming.length > 0 ? (
                upcoming.map(u => (
                  <div key={u.id} className="border rounded-xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.title} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-bold">{u.title}</p>
                        {u.subtitle && <p className="text-sm text-gray-600">{u.subtitle}</p>}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {u.date}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-sky-600">R$ {u.price.toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Nenhum agendamento próximo</p>
                  <Link href="/professionals">
                    <Button className="mt-4 rounded-full">Encontrar Profissional</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            <TabsContent value="past" className="space-y-4">
              {history.length > 0 ? (
                history.map(h => (
                  <div key={h.id} className="border rounded-xl p-4 flex justify-between items-center opacity-75">
                    <div className="flex items-center gap-3">
                      <img src={h.avatar} alt={h.title} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-bold">{h.title}</p>
                        {h.subtitle && <p className="text-sm text-gray-600">{h.subtitle}</p>}
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1"><Calendar className="w-4 h-4" /> {h.date}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-600">R$ {h.price.toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Nenhum atendimento anterior</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}