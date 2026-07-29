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
  direccion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  comentarios?: Comentario[];
}

export interface Comentario {
  id: number;
  contenido: string;
  fechaCreacion: string;
  autorId: number;
  autorNombre: string;
  autorFotoPerfil: string | null;
  publicacionId: number;
  publicacionTitulo: string;
}

export interface PublicacionRequest {
  titulo: string;
  descripcion: string;
  categoria?: string | null;
  latitud?: number;
  longitud?: number;
  direccion?: string | null;
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
