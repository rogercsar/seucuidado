import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.signOut({ scope: 'global' } as any);

    const res = NextResponse.json({ ok: true });
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.headers.set('Pragma', 'no-cache');
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'erro no servidor' }, { status: 500 });
  }
}