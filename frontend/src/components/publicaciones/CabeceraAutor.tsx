"use client";
import Link from "next/link";
import BotonOpcionesPublicacion from "./BotonOpcionesPublicacion";

interface CabeceraAutorProps {
  publicacionId: number;
  autorNombre?: string;
  autorFotoPerfil?: string;
  autorCorreo?: string;
  fechaCreacion: string;
  esPropietario: boolean;
  esAdmin: boolean;
  onDeleteSuccess?: (id: number) => void;
}

export default function CabeceraAutor({
  publicacionId,
  autorNombre,
  autorFotoPerfil,
  autorCorreo,
  fechaCreacion,
  esPropietario,
  esAdmin,
  onDeleteSuccess,
}: CabeceraAutorProps) {
  const perfilUrl = esPropietario
    ? "/perfil"
    : `/perfil/${encodeURIComponent(autorCorreo || "")}`;

  return (
    <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800/60">
      <div className="flex items-center gap-3">
        <Link
          href={perfilUrl}
          onClick={(e) => e.stopPropagation()}
          className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0 border border-gray-200 dark:border-slate-700 hover:border-[hsl(174_72%_40%)] transition"
          title={`Ver perfil de ${autorNombre || "Autor"}`}
        >
          {autorFotoPerfil ? (
            <img src={autorFotoPerfil} alt={autorNombre || "Autor"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500 dark:text-slate-400">
              {autorNombre ? autorNombre.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </Link>

        <div>
          <Link
            href={perfilUrl}
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-semibold text-slate-900 dark:text-white hover:underline hover:text-[hsl(174_72%_40%)] transition-colors block"
          >
            {autorNombre || "Usuario Anónimo"}
          </Link>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 block">
            Compartido el {new Date(fechaCreacion).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <BotonOpcionesPublicacion
          publicacionId={publicacionId}
          esPropietario={esPropietario}
          esAdmin={esAdmin}
          onDeleteSuccess={onDeleteSuccess}
        />
      </div>
    </div>
  );
}
