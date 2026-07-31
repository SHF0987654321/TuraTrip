import apiClient from "@/lib/api-client";
import { Comentario, PageResponse } from "@/types/publicacion";

export interface ComentarioRequest {
  contenido: string;
}

export const comentarioService = {
  listar: async (publicacionId: number | string) => {
    const res = await apiClient.get<Comentario[]>(
      `/v1/publicaciones/${publicacionId}/comentarios`
    );
    return res.data;
  },

  crear: async (publicacionId: number | string, data: ComentarioRequest) => {
    const res = await apiClient.post<Comentario>(
      `/v1/publicaciones/${publicacionId}/comentarios`,
      data
    );
    return res.data;
  },

  editar: async (
    publicacionId: number | string,
    comentarioId: number,
    data: ComentarioRequest
  ) => {
    const res = await apiClient.put<Comentario>(
      `/v1/publicaciones/${publicacionId}/comentarios/${comentarioId}`,
      data
    );
    return res.data;
  },

  eliminar: async (publicacionId: number | string, comentarioId: number) => {
    await apiClient.delete(
      `/v1/publicaciones/${publicacionId}/comentarios/${comentarioId}`
    );
  },

  listarPorUsuario: async (usuarioId: number | string, page = 0, size = 10) => {
    const res = await apiClient.get<PageResponse<Comentario>>(
      `/v1/usuarios/${usuarioId}/comentarios?page=${page}&size=${size}`
    );
    return res.data;
  },
};

export default comentarioService;
