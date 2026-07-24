"use client";
import { useRouter, usePathname } from "next/navigation";
import { Publicacion } from "@/types/publicacion";
import { Rol } from "@/types/usuario";
import CabeceraAutor from "./CabeceraAutor";

interface TarjetaPublicacionProps {
  publicacion: Publicacion;
  onExpandImage: (imagenUrl: string) => void;
  usuarioActualCorreo?: string;
  usuarioRoles?: (string | Rol)[];
  onDeleteSuccess?: (id: number) => void;
}

export default function TarjetaPublicacion({
  publicacion,
  onExpandImage,
  usuarioActualCorreo,
  usuarioRoles = [],
  onDeleteSuccess,
}: TarjetaPublicacionProps) {
  const router = useRouter();
  const pathname = usePathname();

  const yaEnDetalle = pathname === `/publicaciones/${publicacion.id}`;

  const esPropietario = Boolean(
    usuarioActualCorreo && publicacion.autorCorreo === usuarioActualCorreo
  );

  const rolesNombres = usuarioRoles.map((r) =>
    typeof r === "string" ? r : r.nombre
  );
  const esAdmin =
    rolesNombres.includes("ROLE_ADMIN") || rolesNombres.includes("ADMIN");

  const handleCardClick = () => {
    if (!yaEnDetalle) {
      router.push(`/publicaciones/${publicacion.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors ${
        !yaEnDetalle ? "cursor-pointer hover:shadow-md" : ""
      }`}
    >
      {/* SUBCOMPONENTE CABECERA */}
      <CabeceraAutor
        publicacionId={publicacion.id}
        autorNombre={publicacion.autorNombre}
        autorFotoPerfil={publicacion.autorFotoPerfil}
        autorCorreo={publicacion.autorCorreo}
        fechaCreacion={publicacion.fechaCreacion}
        esPropietario={esPropietario}
        esAdmin={esAdmin}
        onDeleteSuccess={onDeleteSuccess}
      />

      {/* CONTENEDOR DE LA IMAGEN */}
      <div
        className="w-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center relative max-h-[500px] overflow-hidden group cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onExpandImage(publicacion.imagen);
        }}
        title="Clic para ampliar imagen"
      >
        <img
          src={publicacion.imagen}
          alt={publicacion.titulo}
          className="w-full h-auto max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </div>

      {/* CONTENIDO */}
      <div className="p-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {publicacion.titulo}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">
          {publicacion.descripcion}
        </p>
      </div>
    </div>
  );
}
