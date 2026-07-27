"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useAuthActions } from "@/hooks/useAuthActions";
import { Field, inputClass } from "@/components/ui/FormField";

export default function OlvidoClavePage() {
  const { recuperarClave } = useAuthActions();

  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const MENSAJE_EXITO_GENERICO =
    "Si tu correo electrónico coincide con una cuenta registrada, recibirás un enlace para restablecer tu contraseña en los próximos minutos.";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    setError("");

    try {
      await recuperarClave(correo);
      setMensaje(MENSAJE_EXITO_GENERICO);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        // Si el servidor responde con 4xx (p. ej. 404 No Encontrado o 400 Bad Request),
        // mantenemos la respuesta neutra por privacidad para evitar enumeración de usuarios.
        if (status && status >= 400 && status < 500) {
          setMensaje(MENSAJE_EXITO_GENERICO);
        } else {
          // Errores 5xx (servidor caído, base de datos fuera de línea) o fallas de red
          setError(
            "Ocurrió un error en el servidor. Por favor, inténtalo más tarde."
          );
        }
      } else {
        setError("Ocurrió un error inesperado al conectar con el servidor.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
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
          Introduce tu correo electrónico para enviarte las instrucciones de
          recuperación.
        </p>
      </div>

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
