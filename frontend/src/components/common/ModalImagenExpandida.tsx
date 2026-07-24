"use client";
import { useEffect } from "react";

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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer animate-fade-in"
      onClick={onClose}
    >
      <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
        <img
          src={imagenUrl}
          alt="Vista ampliada"
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
        />
        <button
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2.5 transition cursor-pointer"
          onClick={onClose}
          title="Cerrar (Esc)"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
