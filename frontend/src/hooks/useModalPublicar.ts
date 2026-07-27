"use client";

import { useState } from "react";
import { publicacionService } from "@/services/publicacionService";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

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
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const resetForm = () => {
    setTitulo("");
    setDescripcion("");
    setArchivo(null);
    setError("");
    setCargando(false);
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
        { titulo, descripcion },
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
    error,
    cargando,
    handleFileSelect,
    handleSubmit,
    handleClose,
    setArchivoFromCamera,
  };
}
