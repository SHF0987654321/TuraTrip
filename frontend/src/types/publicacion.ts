export interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  fechaCreacion: string;
  autorNombre?: string;
  autorFotoPerfil?: string;
}

export interface PublicacionRequest {
  titulo: string;
  descripcion: string;
}