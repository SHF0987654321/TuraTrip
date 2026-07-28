export interface Publicacion {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  fechaCreacion: string;
  autorId: number;
  autorNombre: string;
  autorFotoPerfil: string | null;
  categoriaId?: number | null;
  categoriaNombre?: string | null;
}

export interface PublicacionRequest {
  titulo: string;
  descripcion: string;
  categoria?: string | null;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last?: boolean;
  first?: boolean;
}
