import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Usuario } from "@/types/usuario";

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isHydrated: boolean;
  setAuth: (token: string | null, usuario: Usuario | null) => void;
  actualizarUsuario: (nuevosDatos: Partial<Usuario>) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isHydrated: false,

      setAuth: (token, usuario) => set({ token, usuario }),

      actualizarUsuario: (nuevosDatos) =>
        set((state) => ({
          usuario: state.usuario ? { ...state.usuario, ...nuevosDatos } : null,
        })),

      logout: () => {
        if (typeof document !== "undefined") {
          document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
        }
        set({ token: null, usuario: null });
      },

      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        usuario: state.usuario,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
