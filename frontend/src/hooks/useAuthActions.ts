import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  authService,
  LoginPayload,
  RegistroPayload,
} from "@/services/authService";

export function useAuthActions() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const logoutStore = useAuthStore((s) => s.logout);

  const login = async (data: LoginPayload) => {
    const res = await authService.login(data);
    setAuth(res.token, res.usuario);
    const isProduction = process.env.NODE_ENV === "production";
    const secureFlag = isProduction ? "; Secure" : "";
    document.cookie = `token=${res.token}; path=/; max-age=86400; SameSite=Lax${secureFlag}`;
    router.push("/");
    router.refresh();
  };

  const registro = async (data: RegistroPayload) => {
    await authService.registro(data);
    router.push("/login?verificar=true");
  };

  const recuperarClave = async (correo: string) => {
    return await authService.solicitarRestablecimiento(correo);
  };

  const confirmarNuevaClave = async (token: string, nuevaClave: string) => {
    return await authService.confirmarRestablecimiento(token, nuevaClave);
  };

  const logout = () => {
    logoutStore();
    router.push("/login");
    router.refresh();
  };

  return { login, registro, recuperarClave, confirmarNuevaClave, logout };
}
