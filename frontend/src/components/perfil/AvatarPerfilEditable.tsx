"use client";
import { useRef } from "react";

interface AvatarPerfilEditableProps {
  fotoPerfil?: string;
  nombre?: string;
  esMiPerfil: boolean;
  onAvatarClick: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AvatarPerfilEditable({
  fotoPerfil,
  nombre,
  esMiPerfil,
  onAvatarClick,
  onFileSelect,
}: AvatarPerfilEditableProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative group">
      {/* CONTENEDOR FOTO GRANDE (128px) */}
      <div
        onClick={onAvatarClick}
        className={`w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-800 border-4 border-gray-100 dark:border-slate-800 flex-shrink-0 relative ${
          fotoPerfil ? "cursor-pointer hover:opacity-95 transition" : ""
        }`}
        title={fotoPerfil ? "Haz clic para ver foto completa" : undefined}
      >
        {fotoPerfil ? (
          <img src={fotoPerfil} alt={nombre || "Perfil"} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-400">
            {nombre ? nombre.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </div>

      {/* BOTÓN Y INPUT DE SUBIDA */}
      {esMiPerfil && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="absolute bottom-0 right-0 bg-[hsl(174_72%_40%)] hover:bg-[hsl(174_72%_35%)] text-white p-2.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 transition-transform active:scale-95 cursor-pointer"
            title="Cambiar foto de perfil"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg, image/png, image/webp"
            onChange={onFileSelect}
          />
        </>
      )}
    </div>
  );
}
