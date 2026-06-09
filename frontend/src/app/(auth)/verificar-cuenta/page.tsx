"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function VerificarContenido() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [mensaje, setMensaje] = useState("Validando tu enlace de verificación…");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMensaje("Falta el token de verificación en el enlace.");
      return;
    }

    const verificarToken = async () => {
      try {
        const res = await api.get(`/api/v1/auth/verificar?token=${token}`);
        setStatus("success");
        setMensaje(res.data ?? "¡Cuenta verificada con éxito!");
        
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 3500);
      } catch (err: unknown) {
        setStatus("error");
        if (err && typeof err === "object" && "response" in err) {
          const axiosErr = err as { response?: { data?: string | { error?: string } } };
          const errorMsg = typeof axiosErr.response?.data === "string" 
            ? axiosErr.response.data 
            : (axiosErr.response?.data as { error?: string })?.error;
          
          setMensaje(errorMsg ?? "El enlace expiró o no es válido.");
        } else {
          setMensaje("Error de conexión. No se pudo validar el token.");
        }
      }
    };

    verificarToken();
  }, [token, router]);

  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center gap-6">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="animate-spin text-[hsl(174_72%_40%)]" />
          <h2 className="text-xl font-bold text-[hsl(210_20%_12%)] dark:text-[hsl(174_20%_94%)]" style={{ fontFamily: "Syne, sans-serif" }}>
            Verificando cuenta
          </h2>
          <p className="text-sm text-[hsl(210_10%_52%)]">{mensaje}</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle2 size={44} className="text-green-500" />
          <h2 className="text-xl font-bold text-[hsl(210_20%_12%)] dark:text-[hsl(174_20%_94%)]" style={{ fontFamily: "Syne, sans-serif" }}>
            ¡Todo listo!
          </h2>
          <p className="text-sm text-green-600 dark:text-green-400 px-2">{mensaje}</p>
          <p className="text-xs text-[hsl(210_10%_52%)] mt-2">Redirigiéndote al inicio de sesión…</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-3 w-full">
          <XCircle size={44} className="text-red-500" />
          <h2 className="text-xl font-bold text-[hsl(210_20%_12%)] dark:text-[hsl(174_20%_94%)]" style={{ fontFamily: "Syne, sans-serif" }}>
            No se pudo verificar
          </h2>
          <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-2 w-full">
            <p className="text-sm text-red-600 dark:text-red-400">{mensaje}</p>
          </div>
          <Link
            href="/login"
            className="mt-4 text-sm font-semibold text-[hsl(174_72%_40%)] hover:underline"
          >
            Volver al Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerificarCuentaPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-sm flex flex-col items-center justify-center gap-4">
          <Loader2 size={32} className="animate-spin text-slate-400" />
        </div>
      }
    >
      <VerificarContenido />
    </Suspense>
  );
}