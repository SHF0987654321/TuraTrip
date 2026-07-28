"use client";

import { useState } from "react";
import { publicacionService } from "@/services/publicacionService";
import { formatCommaSeparatedHashtags } from "@/lib/utils";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Helper para limpiar/normalizar el string de la categoría antes de enviarlo
const normalizeCategoria = (cat: string | undefined | null): string => {
  if (!cat) return "";
  const trimmed = cat.trim();
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
};

interface UseModalPublicarProps {
  onSuccess: (idPublicacion: number) => void;
  onClose: () => void;
}

export function useModalPublicar({
  onSuccess,
  onClose,
}: UseModalPublicarProps) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState<string>("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);
  const [direccion, setDireccion] = useState<string>("");

  const resetForm = () => {
    setTitulo("");
    setDescripcion("");
    setCategoria("");
    setArchivo(null);
    setError("");
    setCargando(false);
    setLatitud(null);
    setLongitud(null);
    setDireccion("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setArchivo(null);
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setError(
        "La imagen supera el tamaño máximo permitido (5 MB). Selecciona una más liviana."
      );
      e.target.value = "";
      setArchivo(null);
      return;
    }

    setError("");
    setArchivo(file);
  };

  const handleCategoriaBlur = () => {
    setCategoria(formatCommaSeparatedHashtags(categoria));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archivo) {
      setError("La imagen es obligatoria.");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const nuevaPublicacion = await publicacionService.crear(
        {
          titulo,
          descripcion,
          categoria: normalizeCategoria(categoria) || null,
          latitud: latitud ?? undefined,
          longitud: longitud ?? undefined,
          direccion: direccion || null,
        },
        archivo
      );
      resetForm();
      onSuccess(nuevaPublicacion.id);
      onClose();
    } catch (err: any) {
      setCargando(false);

      if (err.response?.status === 413) {
        setError(
          "La imagen es demasiado grande. El tamaño máximo permitido es de 5 MB."
        );
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Ocurrió un error inesperado al publicar.");
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const setArchivoFromCamera = (file: File) => {
    setError("");
    setArchivo(file);
  };

  return {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    categoria,
    setCategoria,
    handleCategoriaBlur,
    error,
    cargando,
    handleFileSelect,
    handleSubmit,
    handleClose,
    setArchivoFromCamera,
    latitud,
    setLatitud,
    longitud,
    setLongitud,
    direccion,
    setDireccion,
  };
}
