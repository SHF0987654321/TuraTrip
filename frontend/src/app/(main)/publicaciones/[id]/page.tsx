"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Publicacion } from "@/types/publicacion";
import TarjetaPublicacion from "@/components/publicaciones/TarjetaPublicacion";
import { useAuthStore } from "@/store/authStore";

export default function DetallePublicacionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { usuario } = useAuthStore();

  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagenExpandida, setImagenExpandida] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      api
        .get(`/api/v1/publicaciones/${id}`)
        .then((res) => setPublicacion(res.data))
        .catch((err) => console.error("Error al cargar la publicación:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDeleteSuccess = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">
        Cargando publicación...
      </div>
    );
  }

  if (!publicacion) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-gray-400">La publicación no existe o fue eliminada.</p>
        <Link href="/" className="text-[hsl(174_72%_40%)] font-semibold hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6 px-4">
      {/* Botón Volver dinámico */}
      <button
        onClick={() => router.back()}
        className="text-sm text-gray-400 hover:text-white transition inline-flex items-center gap-1 font-medium cursor-pointer"
      >
        ← Volver
      </button>

      {/* Tarjeta Reutilizable pasando directamente usuario?.roles */}
      <TarjetaPublicacion
        publicacion={publicacion}
        onExpandImage={setImagenExpandida}
        usuarioActualCorreo={usuario?.correo}
        usuarioRoles={usuario?.roles}
        onDeleteSuccess={handleDeleteSuccess}
      />

      {/* Modal para ampliar imagen */}
      {imagenExpandida && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setImagenExpandida(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={imagenExpandida}
              alt="Ampliada"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 bg-white/25 text-white rounded-full p-2 hover:bg-white/40 transition"
              onClick={() => setImagenExpandida(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
