"use client";
import { useState } from "react";
import { Perfil } from "@/types/usuario";
import api from "@/lib/api";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

interface UseEditarPerfilHeaderProps {
  perfil: Perfil;
  onPerfilActualizado: (nuevoPerfil: Perfil, nuevaFotoConCache?: string) => void;
}

export function useEditarPerfilHeader({
  perfil,
  onPerfilActualizado,
}: UseEditarPerfilHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(perfil.nombre);
  const [error, setError] = useState<string | null>(null);

  const handleSaveName = async () => {
    if (!nombre.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    try {
      setError(null);
      const res = await api.put("/api/v1/usuarios/perfil", { nombre });
      onPerfilActualizado(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error al guardar el nombre:", err);
      setError("Error al actualizar el nombre de usuario.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      setError("La imagen excede el tamaño máximo permitido (5 MB). Selecciona una más liviana.");
      e.target.value = "";
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append("archivo", file);

    try {
      const res = await api.post("/api/v1/usuarios/perfil/foto", formData);

      const nuevaFotoUrl = res.data.fotoPerfil || res.data;
      const fotoConCache = `${nuevaFotoUrl}?t=${Date.now()}`;

      const perfilActualizado: Perfil = {
        ...perfil,
        fotoPerfil: nuevaFotoUrl,
      };

      onPerfilActualizado(perfilActualizado, fotoConCache);
    } catch (err: any) {
      console.error("Error al subir foto:", err);

      let mensajeError = "No se pudo actualizar la foto de perfil.";
      if (err.response?.status === 413) {
        mensajeError = "La imagen es demasiado grande. El límite máximo es de 5 MB.";
      } else if (err.response?.data?.error) {
        mensajeError = err.response.data.error;
      } else if (err.response?.data?.message) {
        mensajeError = err.response.data.message;
      }

      setError(mensajeError);
    } finally {
      e.target.value = "";
    }
  };

  const cancelarEdicion = () => {
    setNombre(perfil.nombre);
    setIsEditing(false);
    setError(null);
  };

  return {
    nombre,
    setNombre,
    isEditing,
    setIsEditing,
    error,
    setError,
    handleSaveName,
    handleFileChange,
    cancelarEdicion,
  };
}
