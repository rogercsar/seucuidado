import React, { useState } from 'react';
import { Button } from './Button';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'professional'>('user');
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [pricePerHour, setPricePerHour] = useState<string>('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) throw signInErr;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Falha ao autenticar.');
        let assignedRole: 'user' | 'professional' = 'user';
        const { data: rows } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .limit(1);
        if (rows && (rows as any[]).length > 0) {
          const r = (rows as any[])[0]?.role;
          if (r === 'professional') assignedRole = 'professional';
        }
        router.push(assignedRole === 'professional' ? '/pro/dashboard' : '/dashboard');
      } else {
        // Validação de campos para profissional
        if (role === 'professional') {
          if (!specialty.trim() || !city.trim() || !pricePerHour.trim()) {
            setError('Preencha especialidade, cidade e preço/hora.');
            return;
          }
          const priceNum = Number(pricePerHour);
          if (isNaN(priceNum) || priceNum <= 0) {
            setError('Informe um preço/hora válido (> 0).');
            return;
          }
        }
        const { error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, role } }
        } as any);
        if (signUpErr) throw signUpErr;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          alert('Cadastro iniciado. Verifique seu e-mail para confirmar.');
          return;
        }
        // Criar/atualizar registro em public.users com id do auth
        await supabase.from('users').upsert({
          id: user.id,
          email,
          name,
          role
        } as any);
        // Se profissional, criar registro com dados completos
        if (role === 'professional') {
          await supabase.from('professionals').insert({
            user_id: user.id,
            specialty: specialty.trim(),
            price_per_hour: Number(pricePerHour),
            city: city.trim(),
            radius_km: 10,
            approved: false
          } as any);
          router.push('/pro/dashboard');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (e: any) {
      setError(e.message || 'Erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-4 w-full max-w-md">
      <h2 className="font-poppins text-xl font-semibold mb-3">{mode === 'login' ? 'Entrar' : 'Cadastrar'}</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {mode === 'signup' && (
        <>
          <input className="border rounded-xl px-3 py-2 mb-2 w-full" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="mb-3">
            <p className="text-sm mb-2">Selecione seu perfil:</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setRole('user')} className={`px-3 py-2 rounded-xl border ${role === 'user' ? 'bg-sky-100 border-sky-300' : 'bg-white'}`}>Quero contratar</button>
              <button type="button" onClick={() => setRole('professional')} className={`px-3 py-2 rounded-xl border ${role === 'professional' ? 'bg-emerald-100 border-emerald-300' : 'bg-white'}`}>Sou profissional</button>
            </div>
          </div>
          {role === 'professional' && (
            <div className="space-y-2 mb-3">
              <input className="border rounded-xl px-3 py-2 w-full" placeholder="Especialidade" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
              <input className="border rounded-xl px-3 py-2 w-full" placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />
              <input type="number" min="0" step="1" className="border rounded-xl px-3 py-2 w-full" placeholder="Preço/hora (R$)" value={pricePerHour} onChange={(e) => setPricePerHour(e.target.value)} />
            </div>
          )}
        </>
      )}
      <input className="border rounded-xl px-3 py-2 mb-2 w-full" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" className="border rounded-xl px-3 py-2 mb-3 w-full" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="flex items-center gap-2">
        <Button onClick={submit} disabled={loading}>{loading ? 'Carregando...' : (mode === 'login' ? 'Entrar' : 'Cadastrar')}</Button>
        <button className="text-sm underline" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Criar conta' : 'Já tenho conta'}
        </button>
      </div>
    </div>
  );
};