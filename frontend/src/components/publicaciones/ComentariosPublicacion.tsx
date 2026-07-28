"use client";

import { useEffect, useState } from "react";
import { comentarioService, ComentarioRequest } from "@/services/comentarioService";
import { useAuthStore } from "@/store/authStore";
import { Rol } from "@/types/usuario";

interface ComentarioLocal {
  id: number;
  contenido: string;
  fechaCreacion: string;
  autorId: number;
  autorNombre: string;
}

interface ComentariosPublicacionProps {
  publicacionId: number;
  usuarioRoles?: (string | Rol)[];
}

export default function ComentariosPublicacion({
  publicacionId,
  usuarioRoles = [],
}: ComentariosPublicacionProps) {
  const [comentarios, setComentarios] = useState<ComentarioLocal[]>([]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [textoEdicion, setTextoEdicion] = useState("");
  const [guardandoEdicion, setGuardandoEdicion] = useState(false);
  const [confirmandoEliminarId, setConfirmandoEliminarId] = useState<number | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const usuario = useAuthStore((state) => state.usuario);

  const rolesNombres = usuarioRoles.map((r) => (typeof r === "string" ? r : r.nombre));
  const esAdmin = rolesNombres.includes("ROLE_ADMIN") || rolesNombres.includes("ADMIN");

  const cargarComentarios = async () => {
    try {
      const data = await comentarioService.listar(publicacionId);
      setComentarios(
        data.map((c) => ({
          id: c.id,
          contenido: c.contenido,
          fechaCreacion: c.fechaCreacion,
          autorId: c.autorId,
          autorNombre: c.autorNombre,
        }))
      );
    } catch {
      // noop
    }
  };

  useEffect(() => {
    cargarComentarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicacionId]);

  const enviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;

    setCargando(true);
    try {
      await comentarioService.crear(publicacionId, { contenido: texto.trim() });
      setTexto("");
      cargarComentarios();
    } catch {
      // noop
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (c: ComentarioLocal) => {
    setEditandoId(c.id);
    setTextoEdicion(c.contenido);
    setConfirmandoEliminarId(null);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setTextoEdicion("");
  };

  const guardarEdicion = async (comentarioId: number) => {
    const contenido = textoEdicion.trim();
    if (!contenido) return;

    setGuardandoEdicion(true);
    try {
      const data: ComentarioRequest = { contenido };
      await comentarioService.editar(publicacionId, comentarioId, data);
      setComentarios((prev) =>
        prev.map((c) => (c.id === comentarioId ? { ...c, contenido } : c))
      );
      cancelarEdicion();
    } catch {
      alert("No se pudo editar el comentario.");
    } finally {
      setGuardandoEdicion(false);
    }
  };

  const eliminarComentario = async (comentarioId: number) => {
    setEliminandoId(comentarioId);
    try {
      await comentarioService.eliminar(publicacionId, comentarioId);
      setComentarios((prev) => prev.filter((c) => c.id !== comentarioId));
    } catch {
      alert("No se pudo eliminar el comentario.");
    } finally {
      setEliminandoId(null);
      setConfirmandoEliminarId(null);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="space-y-2">
        {comentarios.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sé el primero en comentar.
          </p>
        )}
        {comentarios.map((c) => {
          const esPropio = Boolean(usuario && usuario.id === c.autorId);
          const puedeEliminar = esPropio || esAdmin;
          const enEdicion = editandoId === c.id;

          return (
            <div
              key={c.id}
              className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2"
            >
              {enEdicion ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={textoEdicion}
                    onChange={(e) => setTextoEdicion(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[hsl(174_72%_40%)]"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => guardarEdicion(c.id)}
                      disabled={guardandoEdicion || !textoEdicion.trim()}
                      className="px-3 py-1 text-xs font-semibold bg-[hsl(174_72%_40%)] text-white rounded-xl hover:opacity-90 disabled:bg-gray-400 transition cursor-pointer"
                    >
                      {guardandoEdicion ? "Guardando..." : "Guardar"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelarEdicion}
                      disabled={guardandoEdicion}
                      className="px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    {c.contenido}
                  </p>
                  <div className="flex items-center justify-between mt-1 gap-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {c.autorNombre} • {new Date(c.fechaCreacion).toLocaleString()}
                    </p>

                    {(esPropio || puedeEliminar) && confirmandoEliminarId !== c.id && (
                      <div
                        className="flex items-center gap-2 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {esPropio && (
                          <button
                            type="button"
                            onClick={() => iniciarEdicion(c)}
                            className="text-xs font-semibold text-teal-700 dark:text-teal-300 hover:underline cursor-pointer"
                          >
                            Editar
                          </button>
                        )}
                        {puedeEliminar && (
                          <button
                            type="button"
                            onClick={() => setConfirmandoEliminarId(c.id)}
                            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    )}

                    {confirmandoEliminarId === c.id && (
                      <div
                        className="flex items-center gap-2 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ¿Eliminar?
                        </span>
                        <button
                          type="button"
                          onClick={() => eliminarComentario(c.id)}
                          disabled={eliminandoId === c.id}
                          className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer disabled:opacity-50"
                        >
                          {eliminandoId === c.id ? "Eliminando..." : "Sí"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmandoEliminarId(null)}
                          disabled={eliminandoId === c.id}
                          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline cursor-pointer disabled:opacity-50"
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {usuario && (
        <form onSubmit={enviarComentario} className="flex gap-2">
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="flex-1 p-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-transparent text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-[hsl(174_72%_40%)]"
            placeholder="Escribe un comentario..."
          />
          <button
            type="submit"
            disabled={cargando}
            className="px-3 py-2 text-sm bg-[hsl(174_72%_40%)] text-white rounded-xl hover:opacity-90 disabled:bg-gray-400 transition cursor-pointer"
          >
            {cargando ? "..." : "Enviar"}
          </button>
        </form>
      )}
    </div>
  );
}
