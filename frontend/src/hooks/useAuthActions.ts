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

    // setAuth limpia el token y sincroniza la cookie automáticamente
    setAuth(res.token, res.usuario);

    // Mapeamos los roles recibidos en UsuarioResponse (Set<RolResponse>)
    const roles = res.usuario?.roles || [];
    const esAdmin = roles.some(
      (r: any) =>
        r === "ADMIN" ||
        r === "ROLE_ADMIN" ||
        r?.nombre === "ADMIN" ||
        r?.nombre === "ROLE_ADMIN"
    );

    // Redirección condicional según el rol
    if (esAdmin) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }

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
