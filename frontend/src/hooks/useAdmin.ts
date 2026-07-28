"use client";

import { useState, useEffect, useCallback } from "react";
import { adminService, DashboardStats } from "@/services/adminService";
import { Usuario } from "@/types/usuario";

export function useAdmin() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsuarios();
      setUsuarios(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, usuarios, loading, error, fetchStats, fetchUsuarios };
}
