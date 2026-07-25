"use client";
import { Perfil } from "@/types/usuario";
import AvatarPerfilEditable from "@/components/perfil/AvatarPerfilEditable";
import PerfilNombreForm from "@/components/perfil/PerfilNombreForm";
import { useEditarPerfilHeader } from "@/hooks/useEditarPerfilHeader";

interface TarjetaPerfilHeaderProps {
  perfil: Perfil;
  esMiPerfil: boolean;
  onPerfilActualizado: (nuevoPerfil: Perfil, nuevaFotoConCache?: string) => void;
  onExpandImage: (imagenUrl: string) => void;
}

export default function TarjetaPerfilHeader({
  perfil,
  esMiPerfil,
  onPerfilActualizado,
  onExpandImage,
}: TarjetaPerfilHeaderProps) {
  const {
    nombre,
    setNombre,
    isEditing,
    setIsEditing,
    error,
    setError,
    handleSaveName,
    handleFileChange,
    cancelarEdicion,
  } = useEditarPerfilHeader({ perfil, onPerfilActualizado });

  const handleAvatarClick = () => {
    if (perfil.fotoPerfil) {
      onExpandImage(perfil.fotoPerfil);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
      <h1 className="text-2xl font-black mb-6 text-slate-900 dark:text-white text-center">
        {esMiPerfil ? "Mi Perfil" : `Perfil de ${perfil.nombre}`}
      </h1>

      <div className="flex flex-col items-center gap-4">
        {/* BANNER DE ERROR */}
        {error && (
          <div className="w-full max-w-md p-3 bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 rounded-xl text-xs border border-red-200 dark:border-red-900 text-center flex items-center justify-between gap-2 animate-in fade-in duration-200">
            <span className="flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-200 font-bold px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* SUBCOMPONENTE AVATAR */}
        <AvatarPerfilEditable
          fotoPerfil={perfil.fotoPerfil}
          nombre={perfil.nombre}
          esMiPerfil={esMiPerfil}
          onAvatarClick={handleAvatarClick}
          onFileSelect={handleFileChange}
        />

        {/* SUBCOMPONENTE NOMBRE Y CORREO */}
        <PerfilNombreForm
          nombre={nombre}
          correo={perfil.correo}
          esMiPerfil={esMiPerfil}
          isEditing={isEditing}
          onNombreChange={setNombre}
          onIniciarEdicion={() => setIsEditing(true)}
          onGuardar={handleSaveName}
          onCancelar={cancelarEdicion}
        />
      </div>
    </div>
  );
}
