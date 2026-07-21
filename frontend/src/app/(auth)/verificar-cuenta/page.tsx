"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import axios from "axios";

function VerificarContenido() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");
  const hasVerified = useRef(false);

  const [correoParaReenviar, setCorreoParaReenviar] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error" | "sending">("loading");
  const [mensaje, setMensaje] = useState("Validando tu enlace de verificación…");

  useEffect(() => {
    if (!token || hasVerified.current) return;
    hasVerified.current = true;

    const verificarToken = async () => {
      try {
        const res = await api.get(`/api/v1/auth/verificar?token=${token}`);
        setStatus("success");
        setMensaje(res.data?.mensaje ?? "¡Cuenta verificada con éxito!");
        setTimeout(() => router.push("/login?registered=true"), 2250);
      } catch (err: unknown) {
        setStatus("error");
        if (axios.isAxiosError(err) && err.response?.data) {
          const data = err.response.data as { error: string, correo?: string };
          setMensaje(data.error);
          if (data.correo) setCorreoParaReenviar(data.correo);
        } else {
          setMensaje("El enlace expiró o no es válido.");
        }
      }
    };
    verificarToken();
  }, [token, router]);

  const solicitarNuevoToken = async () => {
    if (!correoParaReenviar) return;
    setStatus("sending");
    try {
      await api.post("/api/v1/auth/reenviar-verificacion", { correo: correoParaReenviar });
      setMensaje("Se ha enviado un nuevo enlace a tu correo.");
      setStatus("success");
    } catch (err: any) {
      setMensaje(err.response?.data?.error || "No pudimos enviar el correo.");
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center gap-6">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="animate-spin text-[hsl(174_72%_40%)]" />
          <h2 className="text-xl font-bold">Verificando cuenta</h2>
          <p className="text-sm text-[hsl(210_10%_52%)]">{mensaje}</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-3 animate-in fade-in duration-500">
          <CheckCircle2 size={44} className="text-green-500" />
          <h2 className="text-xl font-bold">¡Todo listo!</h2>
          <p className="text-sm text-green-600 dark:text-green-400">{mensaje}</p>
          <p className="text-xs text-slate-500">Redirigiendo al login...</p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-3 w-full animate-in fade-in duration-500">
          <XCircle size={44} className="text-red-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">No se pudo verificar</h2>
          
          {/* Contenedor corregido para mayor contraste */}
          <div className="rounded-xl bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-500/50 p-4 w-full">
            <p className="text-sm text-red-700 dark:text-red-100 font-medium">{mensaje}</p>
          </div>
          
          {correoParaReenviar && (
            <button 
              onClick={solicitarNuevoToken} 
              className="flex items-center gap-2 text-sm text-[hsl(174_72%_40%)] hover:underline font-medium mt-2"
            >
              <Mail size={16} /> Solicitar nuevo enlace
            </button>
          )}

          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline mt-2">
            Volver al inicio
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerificarCuentaPage() {
  return (
    <Suspense fallback={<Loader2 size={32} className="animate-spin text-slate-400" />}>
      <VerificarContenido />
    </Suspense>
  );
}