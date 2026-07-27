"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuthActions } from "@/hooks/useAuthActions";
import { Field, inputClass } from "@/components/ui/FormField";

const schema = z.object({
  correo: z.string().email("Ingresa un email válido"),
  clave: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type FormData = z.infer<typeof schema>;

function LoginFormContent() {
  const searchParams = useSearchParams();
  const { login } = useAuthActions();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const registered = searchParams?.get("registered") === "true";
  const verificar = searchParams?.get("verificar") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { correo: "", clave: "" },
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await login(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const resData = err.response.data as { error?: string };
        setServerError(resData.error || "Credenciales incorrectas.");
      } else {
        setServerError("Error de conexión. Intenta más tarde.");
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
          Inicia sesión
        </h2>
        <p className="text-sm text-[hsl(210_10%_52%)] mt-1">
          Accede a tu cuenta para continuar explorando TuraTrip.
        </p>
      </div>

      {registered && (
        <div className="rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 px-4 py-3">
          <p className="text-sm text-green-700 dark:text-green-300">
            ¡Cuenta verificada con éxito!
          </p>
        </div>
      )}

      {verificar && (
        <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 px-4 py-3">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Revisa tu correo para activar tu cuenta.
          </p>
        </div>
      )}

      {serverError && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 px-4 py-3">
          <p className="text-sm text-red-700 dark:text-red-300">
            {serverError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
              placeholder="Tu contraseña"
              autoComplete="current-password"
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

          <div className="flex justify-end mt-1">
            <Link
              href="/olvide-mi-clave"
              className="text-xs font-medium text-[hsl(210_10%_52%)] hover:text-[hsl(174_72%_40%)] transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full flex items-center justify-center gap-2 rounded-2xl bg-[hsl(174_72%_40%)] px-6 py-3.5 text-white font-semibold text-sm hover:bg-[hsl(174_72%_35%)] disabled:opacity-60 transition-colors cursor-pointer"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Iniciando sesión…
            </>
          ) : (
            "Iniciar sesión"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[hsl(210_10%_52%)]">
        ¿Aún no tienes cuenta?{" "}
        <Link
          href="/registro"
          className="font-semibold text-[hsl(174_72%_40%)] hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
