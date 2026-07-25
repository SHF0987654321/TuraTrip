"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import axios from "axios";

export default function OlvidoClavePage() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    setError("");

    try {
      await api.post("/api/v1/auth/restablecer-clave/solicitar", { correo });

      // Respuesta deliberadamente ambigua por protección de datos
      setMensaje(
        "Si tu correo electrónico coincide con una cuenta registrada, recibirás un enlace para restablecer tu contraseña en los próximos minutos."
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data as { error?: string; mensaje?: string };
        setError(data.error || data.mensaje || "No se pudo procesar la solicitud.");
      } else {
        setError("Ocurrió un error inesperado al conectar con el servidor.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
      {/* Encabezado e historia de navegación */}
      <div>
        <Link
          href="/login"
          className="text-sm text-[hsl(210_10%_52%)] hover:text-[hsl(174_72%_40%)] transition-colors mb-6 inline-flex items-center gap-1"
        >
          ← Volver al login
        </Link>
        <h2
          className="text-2xl font-black text-[hsl(210_20%_12%)] dark:text-[hsl(174_20%_94%)] mt-2"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-sm text-[hsl(210_10%_52%)] mt-1">
          Introduce tu correo electrónico para enviarte las instrucciones de recuperación.
        </p>
      </div>

      {/* Estado de mensaje exitoso */}
      {mensaje ? (
        <div className="flex flex-col gap-4 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 p-4">
          <p className="text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
            {mensaje}
          </p>
          <Link
            href="/login"
            className="text-sm font-semibold text-[hsl(174_72%_40%)] hover:underline"
          >
            Regresar al inicio de sesión
          </Link>
        </div>
      ) : (
        /* Formulario principal */
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-4 py-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <Field label="Correo Electrónico">
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@turatrip.com"
              autoComplete="email"
              className={inputClass()}
            />
          </Field>

          <button
            type="submit"
            disabled={cargando}
            className="mt-2 w-full flex items-center justify-center gap-2 rounded-2xl bg-[hsl(174_72%_40%)] px-6 py-3.5 text-white font-semibold text-sm hover:bg-[hsl(174_72%_35%)] disabled:opacity-60 transition-colors cursor-pointer"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {cargando ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Procesando…
              </>
            ) : (
              "Enviar enlace de restauración"
            )}
          </button>
        </form>
      )}

      {!mensaje && (
        <p className="text-center text-sm text-[hsl(210_10%_52%)]">
          <Link
            href="/login"
            className="font-medium hover:text-[hsl(174_72%_40%)] transition-colors"
          >
            Cancelar y regresar
          </Link>
        </p>
      )}
    </div>
  );
}

// ── Helpers idénticos al Login y Registro ─────────────────────────────
function inputClass() {
  return [
    "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all",
    "bg-white dark:bg-[hsl(210_20%_12%)]",
    "text-[hsl(210_20%_12%)] dark:text-[hsl(174_20%_94%)]",
    "placeholder:text-[hsl(210_10%_70%)] dark:placeholder:text-[hsl(210_10%_40%)]",
    "border border-[hsl(174_20%_88%)] dark:border-[hsl(210_15%_20%)] focus:ring-2 focus:ring-[hsl(174_72%_40%)/30%] focus:border-[hsl(174_72%_40%)]",
  ].join(" ");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[hsl(210_20%_30%)] dark:text-[hsl(174_20%_70%)] uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
