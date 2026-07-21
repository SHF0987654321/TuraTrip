"use client";
import { Publicacion } from "@/types/publicacion";
import TarjetaPublicacion from "./TarjetaPublicacion";

interface FeedPublicacionesProps {
  publicaciones: Publicacion[];
  onExpandImage: (imagenUrl: string) => void;
  mensajeVacio?: string;
}

export default function FeedPublicaciones({ 
  publicaciones, 
  onExpandImage, 
  mensajeVacio = "No hay publicaciones disponibles todavía. ¡Sé el primero en compartir un lugar!" 
}: FeedPublicacionesProps) {
  
  if (publicaciones.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800 p-8">
        <p className="text-gray-400 text-sm">{mensajeVacio}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {publicaciones.map((pub) => (
        <TarjetaPublicacion 
          key={pub.id} 
          publicacion={pub} 
          onExpandImage={onExpandImage} 
        />
      ))}
    </div>
  );
}