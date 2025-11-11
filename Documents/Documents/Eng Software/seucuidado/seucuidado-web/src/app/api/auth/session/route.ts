import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: Request) {
  try {
    const { access_token, refresh_token } = await req.json();
    if (!access_token || !refresh_token) {
      return NextResponse.json({ ok: false, error: 'Missing tokens' }, { status: 400 });
    }

    // Prepara a resposta para receber Set-Cookie
    const res = NextResponse.json({ ok: true });
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
            res.cookies.set(name, value, options);
          },
          remove(name: string, options: any) {
            res.cookies.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

    await supabase.auth.setSession({ access_token, refresh_token });

    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}