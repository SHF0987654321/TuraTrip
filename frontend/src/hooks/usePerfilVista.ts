"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Perfil } from "@/types/usuario";
import { Publicacion } from "@/types/publicacion";
import { useAuthStore } from "@/store/authStore";

export function usePerfilVista(correoObjetivo?: string) {
  const { usuario: usuarioActual, actualizarUsuario } = useAuthStore();

  const esMiPerfil: boolean = Boolean(
    !correoObjetivo ||
      (usuarioActual?.correo &&
        correoObjetivo &&
        usuarioActual.correo.toLowerCase() === correoObjetivo.toLowerCase())
  );

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagenExpandida, setImagenExpandida] = useState<string | null>(null);

  // 1. Carga inicial con estado 'loading'
  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (esMiPerfil) {
        const [resPerfil, resPublicaciones] = await Promise.all([
          api.get("/api/v1/usuarios/perfil"),
          api.get("/api/v1/publicaciones/mias"),
        ]);
        setPerfil(resPerfil.data);
        setPublicaciones(resPublicaciones.data);
        actualizarUsuario({
          nombre: resPerfil.data.nombre,
          fotoPerfil: resPerfil.data.fotoPerfil,
        });
      } else if (correoObjetivo) {
        const [resPerfil, resPublicaciones] = await Promise.all([
          api.get(`/api/v1/usuarios/perfil/${encodeURIComponent(correoObjetivo)}`),
          api.get(`/api/v1/publicaciones/usuario/${encodeURIComponent(correoObjetivo)}`),
        ]);
        setPerfil(resPerfil.data);
        setPublicaciones(resPublicaciones.data);
      }
    } catch (err: any) {
      console.error("Error al cargar perfil:", err);
      if (err.response?.status === 404) {
        setError("El perfil buscado no existe o no se encuentra disponible.");
      } else {
        setError("Error al obtener la información del perfil.");
      }
    } finally {
      setLoading(false);
    }
  }, [esMiPerfil, correoObjetivo, actualizarUsuario]);

  // 2. Refetch silencioso: trae las publicaciones nuevas sin activar el spinner 'loading'
  const revalidarPublicaciones = useCallback(async () => {
    try {
      if (esMiPerfil) {
        const resPublicaciones = await api.get("/api/v1/publicaciones/mias");
        setPublicaciones(resPublicaciones.data);
      }
    } catch (err) {
      console.error("Error al actualizar publicaciones del perfil:", err);
    }
  }, [esMiPerfil]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // 3. Listener del evento 'postCreado'
  useEffect(() => {
    if (esMiPerfil) {
      const handlePostCreado = () => revalidarPublicaciones();
      window.addEventListener("postCreado", handlePostCreado);
      return () => window.removeEventListener("postCreado", handlePostCreado);
    }
  }, [esMiPerfil, revalidarPublicaciones]);

  const handleDeleteSuccess = (idEliminado: number) => {
    setPublicaciones((prev) => prev.filter((p) => p.id !== idEliminado));
  };

  const handlePerfilActualizado = (nuevoPerfil: Perfil, nuevaFotoConCache?: string) => {
    setPerfil(nuevoPerfil);
    actualizarUsuario({
      nombre: nuevoPerfil.nombre,
      fotoPerfil: nuevaFotoConCache || nuevoPerfil.fotoPerfil,
    });
  };

  return {
    perfil,
    publicaciones,
    loading,
    error,
    esMiPerfil,
    usuarioActual,
    imagenExpandida,
    setImagenExpandida,
    handleDeleteSuccess,
    handlePerfilActualizado,
  };
}
