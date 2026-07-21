"use client";
import { Publicacion } from "@/types/publicacion";

interface TarjetaPublicacionProps {
  publicacion: Publicacion;
  onExpandImage: (imagenUrl: string) => void;
}

export default function TarjetaPublicacion({ publicacion, onExpandImage }: TarjetaPublicacionProps) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md">
      
      {/* CABECERA CON AUTOR Y FOTO DE PERFIL */}
      <div className="p-4 flex items-center gap-3 border-b border-slate-800/60">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
          {publicacion.autorFotoPerfil ? (
            <img src={publicacion.autorFotoPerfil} alt={publicacion.autorNombre || "Autor"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
              {publicacion.autorNombre ? publicacion.autorNombre.charAt(0).toUpperCase() : "U"}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{publicacion.autorNombre || "Usuario Anónimo"}</h3>
          <span className="text-[11px] text-gray-500">Compartido el {new Date(publicacion.fechaCreacion).toLocaleDateString()}</span>
        </div>
      </div>

      {/* CONTENEDOR DE IMAGEN */}
      <div 
        className="w-full bg-slate-950 flex items-center justify-center cursor-pointer relative max-h-[500px] overflow-hidden"
        onClick={() => onExpandImage(publicacion.imagen)}
      >
        <img 
          src={publicacion.imagen} 
          alt={publicacion.titulo} 
          className="w-full h-auto max-h-[500px] object-contain transition-transform duration-300 hover:scale-[1.01]" 
        />
        <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
          Toca para ampliar
        </span>
      </div>

      <div className="p-5">
        <h2 className="text-lg font-bold text-white">{publicacion.titulo}</h2>
        <p className="text-gray-300 mt-2 text-sm leading-relaxed">{publicacion.descripcion}</p>
      </div>
    </div>
  );
}