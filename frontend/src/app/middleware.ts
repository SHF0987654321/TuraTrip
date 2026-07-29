import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(payload: any): boolean {
  if (!payload || !payload.exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const payload = token ? parseJwtPayload(token) : null;
  const tokenValido = Boolean(token && payload && !isTokenExpired(payload));

  const rutasAuth = ["/login", "/registro"];
  const esRutaAuth = rutasAuth.some((ruta) => pathname.startsWith(ruta));
  const esBienvenida = pathname === "/bienvenida";
  const esRutaAdmin = pathname.startsWith("/dashboard");
  const esPerfil = pathname.startsWith("/perfil");
  const esRaiz = pathname === "/";

  // Helper para redirigir y limpiar cookie corrupta/expirada si existía
  const redirectClean = (targetUrl: string) => {
    const res = NextResponse.redirect(new URL(targetUrl, request.url));
    if (token) res.cookies.delete("token");
    return res;
  };

  // -------------------------------------------------------------
  // CASO 1: USUARIO NO AUTENTICADO (O CON TOKEN EXPIRADO)
  // -------------------------------------------------------------
  if (!tokenValido) {
    // A) Si va al dominio raíz (dominio.com/), redirigir a la landing de bienvenida
    if (esRaiz) {
      return redirectClean("/bienvenida");
    }

    // B) Si intenta ir a áreas estrictamente privadas (perfil, admin dashboard)
    if (esPerfil || esRutaAdmin) {
      return redirectClean("/login");
    }

    // C) NOTA: Las rutas públicas como /publicaciones/123, /bienvenida, /login, /registro
    // NO se bloquean y se dejan pasar.
    return NextResponse.next();
  }

  // -------------------------------------------------------------
  // CASO 2: USUARIO CON TOKEN VÁLIDO (AUTENTICADO)
  // -------------------------------------------------------------

  // Si intenta ir a login, registro o la pantalla de bienvenida, lo mandamos al Feed (/)
  if (esRutaAuth || esBienvenida) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protección del Dashboard de Administrador
  if (esRutaAdmin) {
    const roles: string[] = Array.isArray(payload?.roles) ? payload.roles : [];
    const esAdmin = roles.some(
      (rol) => rol === "ADMIN" || rol === "ROLE_ADMIN"
    );

    if (!esAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Excluimos recursos estáticos (_next, imágenes, favicon, api) y dejamos
   * las rutas controladas explícitamente por la app.
   */
  matcher: [
    "/",
    "/bienvenida",
    "/login",
    "/registro",
    "/perfil/:path*",
    "/dashboard/:path*",
  ],
};
