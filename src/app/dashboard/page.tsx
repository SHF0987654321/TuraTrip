"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[hsl(0_0%_98%)] text-[hsl(210_20%_12%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[hsl(210_15%_80%)] bg-white p-6 shadow-lg shadow-slate-200/50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(174_72%_40%)]">
                Mi panel
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Bienvenido{usuario ? `, ${usuario.nombre}` : ""}.
              </h1>
            </div>
            <Link
              href="/camara"
              className="inline-flex items-center justify-center rounded-2xl bg-[hsl(38_95%_65%)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[hsl(38_95%_55%)]"
            >
              Abrir cámara
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold">Tu espacio de creación</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Desde aquí puedes empezar a tomar fotos cuando quieras. Más adelante se pueden agregar funciones como subir contenido directamente desde esta pantalla.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">Acceso rápido</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Usa el botón superior para abrir la cámara en cualquier momento sin volver al inicio.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h3 className="text-lg font-semibold">Próximas funciones</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                <li>Subir foto desde aquí</li>
                <li>Galería de publicaciones</li>
                <li>Edición rápida antes de publicar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
