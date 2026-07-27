import apiClient from "@/lib/api-client";

export interface LoginPayload {
  correo: string;
  clave: string;
}

export interface RegistroPayload {
  nombre: string;
  correo: string;
  clave: string;
}

export const authService = {
  async login(payload: LoginPayload) {
    const res = await apiClient.post("/api/v1/auth/login", payload);
    return res.data;
  },

  async registro(payload: RegistroPayload) {
    const res = await apiClient.post("/api/v1/auth/registro", payload);
    return res.data;
  },

  async solicitarRestablecimiento(correo: string) {
    const res = await apiClient.post(
      "/api/v1/auth/restablecer-clave/solicitar",
      {
        correo,
      }
    );
    return res.data;
  },
  async confirmarRestablecimiento(token: string, nuevaClave: string) {
    const res = await apiClient.post(
      "/api/v1/auth/restablecer-clave/confirmar",
      { token, nuevaClave }
    );
    return res.data;
  },
};
