import { supabase } from './supabase';

function clearSupabaseLocalStorage() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const match = url.match(/^https?:\/\/([^.]+)\./);
    const ref = match?.[1];
    if (ref) {
      const base = `sb-${ref}-auth-token`;
      localStorage.removeItem(base);
      localStorage.removeItem(`${base}-persist`);
    } else {
      // Fallback: remove any sb-* auth tokens
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('sb-') && k.includes('-auth-token')) {
          localStorage.removeItem(k);
          localStorage.removeItem(`${k}-persist`);
        }
      });
    }
  } catch {
    // noop
  }
}

export async function logoutAndClearAuth() {
  try {
    // Limpa cookies de sessão no servidor (SSR) para o middleware
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    // Também encerra a sessão no cliente
    await supabase.auth.signOut({ scope: 'global' } as any);
  } catch {
    // ignore errors
  } finally {
    clearSupabaseLocalStorage();
  }
}