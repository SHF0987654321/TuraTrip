export interface Rol {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  roles: Rol[];
  creado: string;
  habilitado: boolean;
  fotoPerfil?: string;
}

export interface RegistroRequest {
  nombre: string;
  correo: string;
  clave: string;
  rolesIds: number[];
}

export interface LoginRequest {
  correo: string;
  clave: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface Perfil {
  id: number;
  nombre: string;
  correo: string;
  fotoPerfil: string;
  roles: string[];
}

export interface EditarPerfilRequest {
  nombre: string;
}