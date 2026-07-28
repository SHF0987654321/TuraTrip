"use client";

import { useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminUsuariosPage() {
  const { usuarios, loading, fetchUsuarios } = useAdmin();

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  if (loading) {
    return <p className="text-sm text-slate-500">Cargando usuarios...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Gestión de Usuarios
        </h1>
        <p className="text-sm text-slate-500">
          Lista general de usuarios registrados en la plataforma.
        </p>
      </div>

      {usuarios.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">
            No hay registros de usuarios.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase">
                <th className="p-4">Usuario</th>
                <th className="p-4">Correo</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {usuarios.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                    {u.nombre}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">
                    {u.correo}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.habilitado
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                      }`}
                    >
                      {u.habilitado ? "Activo" : "Pendiente"}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    {u.roles?.map((r) => r.nombre).join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
