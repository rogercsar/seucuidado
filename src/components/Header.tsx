import React from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/router';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/'); // Redirect to home after sign out
  };

  return (
    <header className="bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-2xl font-bold font-poppins text-dark-text dark:text-white">
          Seu<span className="text-primary">Cuidado</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/#services" className="transition-colors hover:text-primary">Serviços</Link>
          <Link href="/#about" className="transition-colors hover:text-primary">Sobre Nós</Link>
          <Link href="/#contact" className="transition-colors hover:text-primary">Contato</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {user ? (
            <>
              <span className="text-sm font-medium">Olá, {user.user_metadata?.full_name || user.email}</span>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={() => router.push('/login')}>Entrar</Button>
              <Button size="sm" onClick={() => router.push('/signup')}>Cadastrar</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
