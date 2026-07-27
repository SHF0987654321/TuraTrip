"use client";

import { useEffect } from "react";
import { getProxyImageUrl } from "@/lib/utils";

interface ModalImagenExpandidaProps {
  imagenUrl: string | null;
  onClose: () => void;
}

export default function ModalImagenExpandida({
  imagenUrl,
  onClose,
}: ModalImagenExpandidaProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!imagenUrl) return null;

  const srcProxy = getProxyImageUrl(imagenUrl);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
      onClick={onClose}
    >
      {/* Botón de cierre fijo arriba a la derecha */}
      <button
        type="button"
        className="fixed top-6 right-6 bg-white/20 hover:bg-white/40 text-white rounded-full p-2.5 transition cursor-pointer z-50 flex items-center justify-center w-10 h-10"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        title="Cerrar (Esc)"
      >
        ✕
      </button>

      {/* La imagen es la única que detiene el clic para no cerrarse */}
      <img
        src={srcProxy || imagenUrl}
        alt="Vista ampliada"
        className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none cursor-default"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
