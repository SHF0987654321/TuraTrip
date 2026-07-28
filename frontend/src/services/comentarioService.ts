import apiClient from "@/lib/api-client";
import {
  Comentario,
  ComentarioRequest,
} from "@/types/comentario";

export const comentarioService = {
  obtenerComentarios: async (publicacionId: number) => {
    const res = await apiClient.get<Comentario[]>(
      `/publicaciones/${publicacionId}/comentarios`
    );

    return res.data;
  },

  crearComentario: async (
    publicacionId: number,
    comentario: ComentarioRequest
  ) => {
    const res = await apiClient.post<Comentario>(
      `/publicaciones/${publicacionId}/comentarios`,
      comentario
    );

    return res.data;
  },
};

export default comentarioService;
