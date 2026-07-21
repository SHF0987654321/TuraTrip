import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Leemos la cookie 'token' que guardas explícitamente en el login
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const esRutaPublica = pathname.startsWith('/login') || pathname.startsWith('/registro') || pathname.startsWith('/bienvenida');

  // Si no hay token e intenta entrar a rutas protegidas -> Al /bienvenida
  if (!token && !esRutaPublica) {
    return NextResponse.redirect(new URL('/bienvenida', request.url));
  }

  // Si ya tiene sesión y está en rutas públicas de acceso -> Al feed (/)
  if (token && esRutaPublica) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/perfil/:path*',
    '/publicar/:path*',
    '/bienvenida',
    '/login',
    '/registro'
  ],
};