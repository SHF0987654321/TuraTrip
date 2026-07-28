"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // Se corrige 'user' por 'usuario', que es el nombre real en tu useAuthStore
  const { usuario, token } = useAuthStore();

  const esAdmin = usuario?.roles?.some(
    (rol) => rol.nombre === "ADMIN" || rol.nombre === "ROLE_ADMIN"
  );

  useEffect(() => {
    // Si no hay token en el cliente, redirigir a /login
    if (!token) {
      router.replace("/login");
      return;
    }

    // Si está autenticado pero no es admin, redirigir a la página principal
    if (!esAdmin) {
      router.replace("/");
    }
  }, [token, esAdmin, router]);

  if (!token || !esAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-sm font-medium animate-pulse">
          Verificando permisos de administrador...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
