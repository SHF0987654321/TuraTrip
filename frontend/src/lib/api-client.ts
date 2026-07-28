import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use((config) => {
  // 1. Obtener token del estado o de auth-storage
  let rawToken = useAuthStore.getState().token;

  if (!rawToken && typeof window !== "undefined") {
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        rawToken = parsed?.state?.token;
      }
    } catch (e) {
      console.error("Error al leer auth-storage:", e);
    }
  }

  // 2. Limpieza estricta: remover retornos de carro, saltos de línea y espacios
  if (rawToken) {
    const cleanToken = String(rawToken)
      .replace(/[\r\n\s]+/g, "")
      .trim();

    // Usar .set() asegura que la cabecera se sobrescriba en un solo string plano
    config.headers.set("Authorization", `Bearer ${cleanToken}`);
  }

  // 3. Dejar que Axios maneje Content-Type para FormData
  if (
    !(config.data instanceof FormData) &&
    !config.headers.has("Content-Type")
  ) {
    config.headers.set("Content-Type", "application/json");
  }

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
