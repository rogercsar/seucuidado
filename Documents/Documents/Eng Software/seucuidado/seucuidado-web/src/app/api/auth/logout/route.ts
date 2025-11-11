import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST() {
  // Cria a resposta primeiro para que o adapter de cookies escreva nela
  const res = NextResponse.json({ ok: true });
  try {
    const requestCookies = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return requestCookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // Escreve cookies na resposta para garantir Set-Cookie
            res.cookies.set(name, value, options);
          },
          remove(name: string, options: any) {
            // Remove de forma explícita com maxAge 0
            res.cookies.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

    await supabase.auth.signOut();

    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.headers.set('Pragma', 'no-cache');
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'erro no servidor' }, { status: 500 });
  }
}