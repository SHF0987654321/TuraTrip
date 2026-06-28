export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[hsl(0_0%_98%)] dark:bg-[hsl(210_22%_8%)]">
        {children}
      </div>
    </div>
  );
}