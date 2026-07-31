import apiClient from "@/lib/api-client";
import { Usuario } from "@/types/usuario";

export interface DashboardStats {
  totalUsuarios: number;
  totalPublicaciones: number;
  totalComentarios: number;
}

export const adminService = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get<DashboardStats>("/v1/admin/estadisticas");
    return res.data;
  },

  getUsuarios: async (): Promise<Usuario[]> => {
    const res = await apiClient.get<Usuario[]>("/v1/admin/usuarios");
    return res.data;
  },
};
