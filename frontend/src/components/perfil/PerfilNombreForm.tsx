"use client";

interface PerfilNombreFormProps {
  nombre: string;
  correo: string;
  esMiPerfil: boolean;
  isEditing: boolean;
  onNombreChange: (nuevoNombre: string) => void;
  onIniciarEdicion: () => void;
  onGuardar: () => void;
  onCancelar: () => void;
}

export default function PerfilNombreForm({
  nombre,
  correo,
  esMiPerfil,
  isEditing,
  onNombreChange,
  onIniciarEdicion,
  onGuardar,
  onCancelar,
}: PerfilNombreFormProps) {
  return (
    <div className="text-center w-full">
      {esMiPerfil && isEditing ? (
        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            value={nombre}
            onChange={(e) => onNombreChange(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-slate-700 rounded-lg text-lg font-bold text-center bg-transparent text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[hsl(174_72%_40%)]"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={onGuardar}
              className="text-xs bg-[hsl(174_72%_40%)] text-white px-3 py-1.5 rounded-lg hover:opacity-90 font-semibold transition cursor-pointer"
            >
              Guardar
            </button>
            <button
              onClick={onCancelar}
              className="text-xs bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <h2
          onClick={() => esMiPerfil && onIniciarEdicion()}
          className={`text-xl font-bold text-slate-900 dark:text-white ${
            esMiPerfil
              ? "cursor-pointer hover:text-[hsl(174_72%_40%)] transition-colors inline-flex items-center gap-2"
              : ""
          }`}
        >
          {nombre} {esMiPerfil && <span className="text-xs opacity-50">✎</span>}
        </h2>
      )}
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{correo}</p>
    </div>
  );
}
