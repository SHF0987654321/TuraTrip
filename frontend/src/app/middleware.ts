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

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const rutasAuth = ["/login", "/registro"];
  const esRutaAuth = rutasAuth.some((ruta) => pathname.startsWith(ruta));
  const esBienvenida = pathname === "/bienvenida";
  const esRutaAdmin =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const esRaiz = pathname === "/";

  // 1. USUARIO SIN TOKEN (NO AUTENTICADO)
  if (!token) {
    if (esRaiz) {
      return NextResponse.redirect(new URL("/bienvenida", request.url));
    }

    if (!esRutaAuth && !esBienvenida) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  // 2. USUARIO CON TOKEN INTENTANDO ACCEDER A RUTAS DE AUTENTICACIÓN
  if (esRutaAuth || esBienvenida) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. PROTECCIÓN DE RUTA ADMIN (/dashboard)
  if (esRutaAdmin) {
    const payload = parseJwtPayload(token);

    // Tu JwtUtils.java guarda el claim bajo la llave "roles"
    const roles: string[] = Array.isArray(payload?.roles) ? payload.roles : [];

    const esAdmin = roles.some(
      (rol) => rol === "ADMIN" || rol === "ROLE_ADMIN"
    );

    // Si no es admin, lo redirigimos al inicio en vez de soltar un 403 en JSON
    if (!esAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/perfil",
    "/perfil/:path*",
    "/publicaciones",
    "/publicaciones/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/bienvenida",
    "/login",
    "/registro",
  ],
};
