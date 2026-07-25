"use client";
import { useModalPublicar } from "@/hooks/useModalPublicar";

interface ModalPublicarProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (idPublicacion: number) => void;
}

export default function ModalPublicar({ isOpen, onClose, onSuccess }: ModalPublicarProps) {
  const {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    error,
    cargando,
    handleFileSelect,
    handleSubmit,
    handleClose,
  } = useModalPublicar({ onSuccess, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full cursor-pointer transition-colors"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Comparte un lugar en el Mundo
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-900 animate-in fade-in duration-150">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Título del lugar
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              maxLength={255}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[hsl(174_72%_40%)]"
              placeholder="Ej: Playa Piangüita"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              maxLength={1000}
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[hsl(174_72%_40%)] resize-none"
              placeholder="Cuéntanos qué tiene de especial..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Foto (JPG, JPEG, PNG o WebP - Máx 5 MB)
            </label>
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileSelect}
              required
              className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 dark:file:bg-teal-950 dark:file:text-teal-300 hover:file:bg-teal-100 cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-6 py-2.5 bg-[hsl(174_72%_40%)] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:bg-gray-400 transition shadow-md cursor-pointer"
            >
              {cargando ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
