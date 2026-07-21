"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Publicacion } from "@/types/publicacion";
import FeedPublicaciones from "@/components/publicaciones/FeedPublicaciones";

export default function MainPage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagenExpandida, setImagenExpandida] = useState<string | null>(null);

  useEffect(() => {
    api.get("/api/v1/publicaciones")
      .then((res) => setPublicaciones(res.data))
      .catch((err) => console.error("Error al cargar las publicaciones:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-400">Cargando publicaciones del Mundo...</div>;
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6 px-4">
      <h1 className="text-2xl font-black text-slate-100 tracking-tight text-center">Descubre el Mundo</h1>
      {/* SECCIÓN DE PUBLICACIONES MODULARIZADA */}
      <FeedPublicaciones 
        publicaciones={publicaciones} 
        onExpandImage={setImagenExpandida} 
        mensajeVacio="No hay publicaciones disponibles todavía. ¡Sé el primero en compartir un lugar!"
      />

      {/* MODAL PARA VER IMAGEN EN TAMAÑO REAL */}
      {imagenExpandida && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setImagenExpandida(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img src={imagenExpandida} alt="Ampliada" className="max-w-full max-h-full object-contain rounded-lg" />
            <button 
              className="absolute top-4 right-4 bg-white/20 text-white rounded-full p-2 hover:bg-white/40 transition"
              onClick={() => setImagenExpandida(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}