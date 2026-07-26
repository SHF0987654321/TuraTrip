import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const rutasPublicas = ["/login", "/registro", "/bienvenida"];
  const esRutaPublica = rutasPublicas.some((ruta) => pathname.startsWith(ruta));

  // Si no tiene token e intenta ingresar a una ruta protegida -> Redirigir a bienvenida
  if (!token && !esRutaPublica) {
    return NextResponse.redirect(new URL("/bienvenida", request.url));
  }

  // Si ya tiene token e intenta ingresar a login/registro/bienvenida -> Redirigir al feed
  if (token && esRutaPublica) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/perfil/:path*",
    "/publicaciones/:path*",
    "/bienvenida",
    "/login",
    "/registro",
  ],
};
