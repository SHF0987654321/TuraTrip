"use client";

import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminDashboardPage() {
  const { stats, loading, fetchStats } = useAdmin();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando métricas...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Panel de Control
        </h1>
        <p className="text-sm text-slate-500">
          Bienvenido al centro de administración de TuraTrip.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">
            Usuarios Registrados
          </p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.totalUsuarios ?? 0}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">
            Publicaciones
          </p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.totalPublicaciones ?? 0}
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500 font-semibold uppercase">
            Comentarios
          </p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats?.totalComentarios ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
