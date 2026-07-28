"use client";

import { useState } from "react";
import { useComentarios } from "@/hooks/useComentario";

interface ComentariosProps {
  publicacionId: number;
}

export default function Comentarios({
  publicacionId,
}: ComentariosProps) {
  const {
    comentarios,
    loading,
    crearComentario,
  } = useComentarios(publicacionId);

  const [contenido, setContenido] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async () => {
    if (!contenido.trim()) return;

    try {
      setEnviando(true);

      await crearComentario(contenido);

      setContenido("");
    } catch (error) {
      console.error("Error al publicar comentario:", error);
      alert("No fue posible publicar el comentario.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">

      <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">
        Comentarios
      </h3>

      {loading ? (
        <p className="text-sm text-gray-500">
          Cargando comentarios...
        </p>
      ) : comentarios.length === 0 ? (
        <p className="text-sm text-gray-500">
          Aún no hay comentarios.
        </p>
      ) : (
        <div className="space-y-3 mb-4">
          {comentarios.map((comentario) => (
            <div
              key={comentario.id}
              className="rounded-lg bg-slate-100 dark:bg-slate-800 p-3"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-sm">
                  {comentario.autorNombre}
                </span>

                <span className="text-xs text-gray-500">
                  {new Date(
                    comentario.fechaCreacion
                  ).toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                {comentario.contenido}
              </p>
            </div>
          ))}
        </div>
      )}

      <textarea
        value={contenido}
        onChange={(e) => setContenido(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="Escribe un comentario..."
        className="w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex justify-end mt-3">
        <button
          onClick={handleSubmit}
          disabled={enviando || !contenido.trim()}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium transition"
        >
          {enviando ? "Publicando..." : "Publicar"}
        </button>
      </div>

    </div>
  );
}
