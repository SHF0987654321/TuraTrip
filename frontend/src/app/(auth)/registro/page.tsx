"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";

// ── Schema de validación ──────────────────────────────────────────────
const schema = z
  .object({
    nombre: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "Máximo 100 caracteres"),
    correo: z.string().email("Ingresa un email válido"),
    clave: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[@$!%*?&]/, "Debe contener al menos un carácter especial (@$!%*?&)"),
    confirmarClave: z.string(),
  })
  .refine((data) => data.clave === data.confirmarClave, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarClave"],
  });

type FormData = z.infer<typeof schema>;

// ── Componente ────────────────────────────────────────────────────────
export default function RegistroPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      const res = await api.post("/api/v1/auth/registro", {
        nombre: data.nombre,
        correo: data.correo,
        clave: data.clave,
      });

      // Si el backend devuelve token en el registro, lo guardamos
      if (res.data.token) {
        setAuth(res.data.token, res.data.usuario);
        router.push("/");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === "object" &&
        "response" in err
      ) {
        const axiosErr = err as { response?: { status?: number; data?: { error?: string } } };
        if (axiosErr.response?.status === 409) {
          setServerError("Este correo ya está registrado. ¿Quieres iniciar sesión?");
        } else {
          setServerError(
            axiosErr.response?.data?.error ?? "Error al crear la cuenta. Intenta de nuevo."
          );
        }
      } else {
        setServerError("Error de conexión. Verifica tu red.");
      }
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
      {/* Header */}
      <div>
        <Link
          href="/"
          className="text-sm text-[hsl(210_10%_52%)] hover:text-[hsl(174_72%_40%)] transition-colors mb-6 inline-flex items-center gap-1"
        >
          ← Volver
        </Link>
        <h2
          className="text-2xl font-black text-[hsl(210_20%_12%)] dark:text-[hsl(174_20%_94%)] mt-2"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Crea tu cuenta
        </h2>
        <p className="text-sm text-[hsl(210_10%_52%)] mt-1">
          Únete y empieza a descubrir lugares increíbles
        </p>
      </div>

      {/* Error del servidor */}
      {serverError && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3">
          <p className="text-sm text-red-600 dark:text-red-400">{serverError}</p>
          {serverError.includes("ya está registrado") && (
            <Link
              href="/login"
              className="text-sm font-semibold text-[hsl(174_72%_40%)] hover:underline mt-1 inline-block"
            >
              Ir a iniciar sesión →
            </Link>
          )}
        </div>
      )}

      {/* Formulario */}
      <div className="flex flex-col gap-4">
        {/* Nombre */}
        <Field label="Nombre completo" error={errors.nombre?.message}>
          <input
            {...register("nombre")}
            type="text"
            placeholder="Tu nombre"
            autoComplete="name"
            className={inputClass(!!errors.nombre)}
          />
        </Field>

        {/* Correo */}
        <Field label="Correo electrónico" error={errors.correo?.message}>
          <input
            {...register("correo")}
            type="email"
            placeholder="correo@ejemplo.com"
            autoComplete="email"
            className={inputClass(!!errors.correo)}
          />
        </Field>

        {/* Contraseña */}
        <Field label="Contraseña" error={errors.clave?.message}>
          <div className="relative">
            <input
              {...register("clave")}
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className={inputClass(!!errors.clave) + " pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(210_10%_52%)] hover:text-[hsl(174_72%_40%)] transition-colors"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        {/* Confirmar contraseña */}
        <Field label="Confirmar contraseña" error={errors.confirmarClave?.message}>
          <div className="relative">
            <input
              {...register("confirmarClave")}
              type={showConfirm ? "text" : "password"}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              className={inputClass(!!errors.confirmarClave) + " pr-10"}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(210_10%_52%)] hover:text-[hsl(174_72%_40%)] transition-colors"
              aria-label={showConfirm ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        {/* Submit */}
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-2xl bg-[hsl(174_72%_40%)] px-6 py-3.5 text-white font-semibold text-sm hover:bg-[hsl(174_72%_35%)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creando cuenta…
            </>
          ) : (
            "Crear cuenta"
          )}
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-[hsl(210_10%_52%)]">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-[hsl(174_72%_40%)] hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────
function inputClass(hasError: boolean) {
  return [
    "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all",
    "bg-white dark:bg-[hsl(210_20%_12%)]",
    "text-[hsl(210_20%_12%)] dark:text-[hsl(174_20%_94%)]",
    "placeholder:text-[hsl(210_10%_70%)] dark:placeholder:text-[hsl(210_10%_40%)]",
    hasError
      ? "border border-red-400 focus:ring-2 focus:ring-red-300"
      : "border border-[hsl(174_20%_88%)] dark:border-[hsl(210_15%_20%)] focus:ring-2 focus:ring-[hsl(174_72%_40%)/30%] focus:border-[hsl(174_72%_40%)]",
  ].join(" ");
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[hsl(210_20%_30%)] dark:text-[hsl(174_20%_70%)] uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}