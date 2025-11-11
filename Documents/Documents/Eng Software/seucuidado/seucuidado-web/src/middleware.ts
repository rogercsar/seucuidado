import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // Aplicar cabeçalhos de no-cache em rotas protegidas
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/pro') ||
    pathname.startsWith('/professional')
  ) {
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');

    // Verificar sessão via cookies no edge e redirecionar se não autenticado
    try {
      const supabase = createMiddlewareClient({ req, res });
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = '/auth';
        redirectUrl.search = '';
        return NextResponse.redirect(redirectUrl);
      }
    } catch (e) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth';
      redirectUrl.search = '';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/pro/:path*', '/professional/:path*'],
};