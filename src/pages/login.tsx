import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Erro: ${error.message}`);
    } else {
      // Redirect to dashboard on successful login
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-dark-bg/50 rounded-lg shadow-soft">
        <h2 className="text-center text-3xl font-bold font-poppins text-dark-text dark:text-white">
          Acesse sua conta
        </h2>
        {message && <p className="text-center p-2 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-md">{message}</p>}
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full p-3 bg-neutral dark:bg-dark-bg border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 w-full p-3 bg-neutral dark:bg-dark-bg border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary/80">
                Esqueceu sua senha?
              </a>
            </div>
          </div>
          <div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
        <p className="text-center text-sm">
          Não tem uma conta?{' '}
          <Link href="/signup" className="font-medium text-primary hover:text-primary/80">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
