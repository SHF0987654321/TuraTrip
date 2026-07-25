"use client";

import { useEffect, useRef } from "react";

interface ToastProps {
  mostrar: boolean;
  mensaje: string;
  onClose: () => void;
  duracionMs?: number;
  accion?: {
    label: string;
    onClick: () => void;
  };
}

export default function Toast({
  mostrar,
  mensaje,
  onClose,
  duracionMs = 4000,
  accion,
}: ToastProps) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!mostrar) return;

    const timer = setTimeout(() => {
      onCloseRef.current();
    }, duracionMs);

    return () => clearTimeout(timer);
  }, [mostrar, duracionMs]);

  if (!mostrar) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <span className="text-sm font-medium">{mensaje}</span>

      <div className="flex items-center gap-2">
        {accion && (
          <button
            onClick={() => {
              onClose();
              accion.onClick();
            }}
            className="bg-[hsl(174_72%_40%)] hover:bg-[hsl(174_72%_35%)] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            {accion.label}
          </button>
        )}
      </div>
    </div>
  );
}
