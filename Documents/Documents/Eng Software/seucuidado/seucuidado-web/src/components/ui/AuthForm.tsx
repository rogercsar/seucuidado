import React, { useState } from 'react';
import { Button } from './Button';
import { supabase } from '../../lib/supabase';

export const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      alert('Autenticado com sucesso!');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-4 w-full max-w-md">
      <h2 className="font-poppins text-xl font-semibold mb-3">{mode === 'login' ? 'Entrar' : 'Cadastrar'}</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
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