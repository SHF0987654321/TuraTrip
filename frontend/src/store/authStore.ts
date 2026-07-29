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

// Helper para setear/limpiar cookie de forma consistente
const syncTokenCookie = (token: string | null) => {
  if (typeof document === "undefined") return;

  const isProduction = process.env.NODE_ENV === "production";
  const secureFlag = isProduction ? "; Secure" : "";

  if (token) {
    const maxAge = 7 * 24 * 60 * 60; // 7 días
    document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
  } else {
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secureFlag}`;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isHydrated: false,

      setAuth: (token, usuario) => {
        const cleanToken = token
          ? String(token)
              .replace(/[\r\n\s]+/g, "")
              .trim()
          : null;

        // Sincronizar cookie para Next Middleware
        syncTokenCookie(cleanToken);

        set({ token: cleanToken, usuario });
      },

      actualizarUsuario: (nuevosDatos) =>
        set((state) => ({
          usuario: state.usuario ? { ...state.usuario, ...nuevosDatos } : null,
        })),

      logout: () => {
        // Eliminar cookie
        syncTokenCookie(null);
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
        // Al rehidratar desde localStorage, aseguramos que la cookie esté alineada
        if (state?.token) {
          syncTokenCookie(state.token);
        }
        state?.setHydrated(true);
      },
    }
  )
);
