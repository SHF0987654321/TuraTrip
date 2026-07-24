"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/lib/api";
import axios from "axios";

function RecuperarClaveForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("El enlace de restauración es inválido o ha expirado.");
    }
  }, [token]);

  const handleRestablecer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (nuevaClave !== confirmarClave) {
      setError("Las contraseñas ingresadas no coinciden.");
      return;
    }

    if (nuevaClave.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setCargando(true);
    try {
      await api.post("/api/v1/auth/restablecer-clave/confirmar", {
        token,
        nuevaClave,
      });

      setExito(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data as { error?: string; message?: string };
        setError(data.error || data.message || "Error al intentar redefinir la clave.");
      } else {
        setError("Ocurrió un error inesperado al conectar con el servidor.");
      }
    } finally {
      setCargando(false);
    }
  };

  // Si falta el token en la URL
  if (!token) {
    return (
      <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 flex flex-col gap-3">
        <p className="text-sm text-red-700 dark:text-red-300 font-medium">
          �  {error || "Petición inválida. Acceso restringido."}
        </p>
        <Link
          href="/login"
          className="text-xs font-semibold text-[hsl(174_72%_40%)] hover:underline"
        >
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  // Estado cuando el cambio fue exitoso
  if (exito) {
    return (
      <div className="rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 space-y-3">
        <p className="text-sm text-green-700 dark:text-green-300 font-medium">
          ¡Tu contraseña ha sido actualizada con éxito!
        </p>
        <p className="text-xs text-[hsl(210_10%_52%)]">
          Redirigiéndote al inicio de sesión en unos segundos…
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleRestablecer} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-4 py-3">
          <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-1.5">
            <span aria-hidden="true">� </span> {error}
          </p>
        </div>
      )}

      {/* Campo: Nueva Contraseña */}
      <Field label="Nueva Contraseña">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={nuevaClave}
            onChange={(e) => setNuevaClave(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            className={inputClass() + " pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(210_10%_52%)] hover:text-[hsl(174_72%_40%)] transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      {/* Campo: Confirmar Contraseña */}
      <Field label="Confirmar Contraseña">
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            required
            value={confirmarClave}
            onChange={(e) => setConfirmarClave(e.target.value)}
            placeholder="Repite tu nueva contraseña"
            autoComplete="new-password"
            className={inputClass() + " pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(210_10%_52%)] hover:text-[hsl(174_72%_40%)] transition-colors"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      <button
        type="submit"
        disabled={cargando}
        className="mt-2 w-full flex items-center justify-center gap-2 rounded-2xl bg-[hsl(174_72%_40%)] px-6 py-3.5 text-white font-semibold text-sm hover:bg-[hsl(174_72%_35%)] disabled:opacity-60 transition-colors cursor-pointer"
        style={{ fontFamily: "Syne, sans-serif" }}
      >
        {cargando ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Guardando…
          </>
        ) : (
          "Restablecer contraseña"
        )}
      </button>
    </form>
  );
}

export default function RecuperarClavePage() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-6 mx-auto">
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
          Restablecer Contraseña
        </h2>
        <p className="text-sm text-[hsl(210_10%_52%)] mt-1">
          Ingresa tu nueva contraseña para volver a acceder a tu cuenta.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="w-full flex flex-col gap-4">
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
        }
      >
        <RecuperarClaveForm />
      </Suspense>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────
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
