import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo decorativo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[hsl(174_72%_15%)] flex-col items-center justify-center p-12">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[hsl(174_72%_25%)] opacity-40" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[hsl(174_65%_30%)] opacity-30" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-[hsl(38_95%_55%)] opacity-10" />

        <div className="relative z-10 text-center">
          <h1
            className="text-6xl font-black text-white mb-4 tracking-tight"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Tura<span className="text-[hsl(38_95%_55%)]">Trip</span>
          </h1>
          <p className="text-[hsl(174_40%_75%)] text-lg leading-relaxed max-w-xs">
            Descubre lugares increíbles y comparte tus aventuras con viajeros de
            todo el mundo.
          </p>

          <div className="mt-12 space-y-3 text-left">
            {[
              { emoji: "🏔️", name: "Sierra Nevada", loc: "Colombia", likes: 234 },
              { emoji: "🏖️", name: "Playa Spratt Bight", loc: "San Andrés", likes: 189 },
              { emoji: "🏛️", name: "Castillo San Felipe", loc: "Cartagena", likes: 312 },
            ].map((place) => (
              <div
                key={place.name}
                className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3"
              >
                <span className="text-2xl">{place.emoji}</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{place.name}</p>
                  <p className="text-[hsl(174_40%_70%)] text-xs">{place.loc}</p>
                </div>
                <span className="text-[hsl(38_95%_65%)] text-xs font-semibold">
                  ♥ {place.likes}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — CTA */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[hsl(0_0%_98%)] dark:bg-[hsl(210_22%_8%)]">
        <div className="w-full max-w-sm flex flex-col items-center gap-8">

          {/* Logo mobile (solo visible sin panel izquierdo) */}
          <div className="text-center lg:hidden">
            <h1
              className="text-4xl font-black tracking-tight text-[hsl(210_20%_12%)] dark:text-[hsl(174_20%_94%)]"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Tura<span className="text-[hsl(174_72%_40%)]">Trip</span>
            </h1>
            <p className="mt-2 text-sm text-[hsl(210_10%_52%)]">
              Tu red social de turismo
            </p>
          </div>

          {/* Logo desktop */}
          <div className="text-center hidden lg:block">
            <p className="text-sm text-[hsl(210_10%_52%)]">
              Bienvenido a TuraTrip
            </p>
            <p className="mt-1 text-xs text-[hsl(210_10%_65%)]">
              Únete a miles de viajeros
            </p>
          </div>

          {/* Botones */}
          <div className="w-full flex flex-col gap-3">
            <Link
              href="/registro"
              className="w-full flex items-center justify-center rounded-2xl bg-[hsl(174_72%_40%)] px-6 py-3.5 text-white font-semibold text-sm hover:bg-[hsl(174_72%_35%)] transition-colors"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Crear cuenta gratis
            </Link>

            <Link
              href="/login"
              className="w-full flex items-center justify-center rounded-2xl border border-[hsl(174_20%_88%)] dark:border-[hsl(210_15%_20%)] px-6 py-3.5 text-[hsl(210_20%_12%)] dark:text-[hsl(174_20%_94%)] font-semibold text-sm hover:border-[hsl(174_72%_40%)] hover:text-[hsl(174_72%_40%)] transition-colors"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Iniciar sesión
            </Link>
          </div>

          {/* Separador */}
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-[hsl(174_20%_88%)] dark:bg-[hsl(210_15%_20%)]" />
            <span className="text-xs text-[hsl(210_10%_52%)]">o continúa con</span>
            <div className="flex-1 h-px bg-[hsl(174_20%_88%)] dark:bg-[hsl(210_15%_20%)]" />
          </div>

          {/* Google placeholder */}
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[hsl(174_20%_88%)] dark:border-[hsl(210_15%_20%)] px-6 py-3 text-sm text-[hsl(210_10%_52%)] cursor-not-allowed opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google (próximamente)
          </button>

          <p className="text-xs text-center text-[hsl(210_10%_52%)]">
            Al continuar aceptas nuestros{" "}
            <span className="text-[hsl(174_72%_40%)] cursor-pointer hover:underline">
              Términos de uso
            </span>{" "}
            y{" "}
            <span className="text-[hsl(174_72%_40%)] cursor-pointer hover:underline">
              Política de privacidad
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}