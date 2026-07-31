import apiClient from "@/lib/api-client";
import { Perfil } from "@/types/usuario";

export const usuarioService = {
  getPerfil: async () => {
    const res = await apiClient.get<Perfil>("/v1/usuarios/perfil");
    return res.data;
  },

  getPerfilPorId: async (id: number | string) => {
    const res = await apiClient.get<Perfil>(`/v1/usuarios/perfil/${id}`);
    return res.data;
  },

  actualizarNombre: async (nombre: string) => {
    const res = await apiClient.put<Perfil>("/v1/usuarios/perfil", {
      nombre,
    });
    return res.data;
  },

  actualizarFoto: async (archivo: File) => {
    const formData = new FormData();
    formData.append("archivo", archivo);

    const res = await apiClient.post<{ fotoPerfil: string }>(
      "/v1/usuarios/perfil/foto",
      formData
    );
    return res.data;
  },
};
