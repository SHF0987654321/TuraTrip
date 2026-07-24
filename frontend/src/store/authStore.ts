import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Usuario } from "@/types/usuario";

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  setAuth: (token: string | null, usuario: Usuario | null) => void;
  actualizarUsuario: (nuevosDatos: Partial<Usuario>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      setAuth: (token, usuario) => set({ token, usuario }),
      // Actualiza parcialmente el usuario sin perder los demás datos
      actualizarUsuario: (nuevosDatos) =>
        set((state) => ({
          usuario: state.usuario ? { ...state.usuario, ...nuevosDatos } : null,
        })),
      logout: () => {
        // Borra la cookie físicamente para que el middleware detecte la salida
        if (typeof document !== "undefined") {
          document.cookie = "token=; path=/; max-age=0";
        }
        set({ token: null, usuario: null });
      },
    }),
    { name: "auth-storage" }
  )
);
