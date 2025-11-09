import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setMessage(`Erro: ${error.message}`);
    } else {
      setMessage('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-dark-bg/50 rounded-lg shadow-soft">
        <h2 className="text-center text-3xl font-bold font-poppins text-dark-text dark:text-white">
          Crie sua conta
        </h2>
        {message && <p className="text-center p-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-md">{message}</p>}
        <form className="space-y-6" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="name">Nome Completo</label>
            <input
              id="name"
              type="text"
              required
              className="mt-1 w-full p-3 bg-neutral dark:bg-dark-bg border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              required
              className="mt-1 w-full p-3 bg-neutral dark:bg-dark-bg border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </div>
        </form>
        <p className="text-center text-sm">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
