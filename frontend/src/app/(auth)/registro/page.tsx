"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuthActions } from "@/hooks/useAuthActions";
import { Field, inputClass } from "@/components/ui/FormField";

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
      .regex(
        /[@$!%*?&]/,
        "Debe contener al menos un carácter especial (@$!%*?&)"
      ),
    confirmarClave: z.string(),
  })
  .refine((data) => data.clave === data.confirmarClave, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarClave"],
  });

type FormData = z.infer<typeof schema>;

export default function RegistroPage() {
  const { registro } = useAuthActions();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await registro({
        nombre: data.nombre,
        correo: data.correo,
        clave: data.clave,
      });
      reset();
    } catch (err: unknown) {
      setServerError(
        "Si los datos son correctos, recibirás un correo electrónico con instrucciones para completar tu registro."
      );
      if (axios.isAxiosError(err)) {
        console.error(
          "Error técnico del servidor:",
          err.response?.status,
          err.response?.data
        );
      }
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
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

      {serverError && (
        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 px-4 py-3">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            {serverError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Nombre completo" error={errors.nombre?.message}>
          <input
            {...register("nombre")}
            type="text"
            placeholder="Tu nombre"
            autoComplete="name"
            className={inputClass(!!errors.nombre)}
          />
        </Field>

        <Field label="Correo electrónico" error={errors.correo?.message}>
          <input
            {...register("correo")}
            type="email"
            placeholder="correo@ejemplo.com"
            autoComplete="email"
            className={inputClass(!!errors.correo)}
          />
        </Field>

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
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <Field
          label="Confirmar contraseña"
          error={errors.confirmarClave?.message}
        >
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
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-2xl bg-[hsl(174_72%_40%)] px-6 py-3.5 text-white font-semibold text-sm hover:bg-[hsl(174_72%_35%)] disabled:opacity-60 transition-colors"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Creando cuenta…
            </>
          ) : (
            "Crear cuenta"
          )}
        </button>
      </form>

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
