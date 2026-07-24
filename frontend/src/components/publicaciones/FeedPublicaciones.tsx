"use client";
import { Publicacion } from "@/types/publicacion";
import TarjetaPublicacion from "./TarjetaPublicacion";
import { Rol } from "@/types/usuario";

interface FeedPublicacionesProps {
  publicaciones: Publicacion[];
  onExpandImage: (imagenUrl: string) => void;
  mensajeVacio?: string;
  usuarioActualCorreo?: string;
  usuarioRoles?: (string | Rol)[];
  onDeleteSuccess?: (id: number) => void;
}

export default function FeedPublicaciones({
  publicaciones,
  onExpandImage,
  mensajeVacio = "No hay publicaciones disponibles todavía. ¡Sé el primero en compartir un lugar!",
  usuarioActualCorreo,
  usuarioRoles,
  onDeleteSuccess,
}: FeedPublicacionesProps) {

  if (publicaciones.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-8 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400 text-sm">{mensajeVacio}</p>
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
          usuarioActualCorreo={usuarioActualCorreo}
          usuarioRoles={usuarioRoles}
          onDeleteSuccess={onDeleteSuccess}
        />
      ))}
    </div>
  );
}
