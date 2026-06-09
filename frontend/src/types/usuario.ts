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