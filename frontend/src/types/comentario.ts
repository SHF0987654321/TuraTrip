export interface Comentario {
  id: number;
  contenido: string;
  fechaCreacion: string;
  autorId: number;
  autorNombre: string;
  autorFotoPerfil: string | null;
}

export interface ComentarioRequest {
  contenido: string;
}
