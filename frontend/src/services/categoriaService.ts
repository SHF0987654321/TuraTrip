import apiClient from "@/lib/api-client";
import { Categoria, CategoriaRequest } from "@/types/categoria";

export const categoriaService = {
  getCategorias: async () => {
    const res = await apiClient.get<Categoria[]>("/v1/categorias");
    return res.data;
  },

  crear: async (payload: CategoriaRequest) => {
    const res = await apiClient.post<Categoria>("/v1/categorias", payload);
    return res.data;
  },

  actualizar: async (id: number, payload: CategoriaRequest) => {
    const res = await apiClient.put<Categoria>(`/v1/categorias/${id}`, payload);
    return res.data;
  },

  eliminar: async (id: number) => {
    await apiClient.delete(`/v1/categorias/${id}`);
  },
};
