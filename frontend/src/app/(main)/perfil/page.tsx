"use client";
import { useEffect, useState, useRef } from "react";
import api from "@/lib/api"; 
import { Perfil } from "@/types/usuario";
import { Publicacion } from "@/types/publicacion";
import FeedPublicaciones from "@/components/publicaciones/FeedPublicaciones";

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState("");
  const [imagenExpandida, setImagenExpandida] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPerfil, resPublicaciones] = await Promise.all([
          api.get("/api/v1/usuarios/perfil"),
          api.get("/api/v1/publicaciones/mias")
        ]);
        
        setPerfil(resPerfil.data);
        setNombre(resPerfil.data.nombre);
        setPublicaciones(resPublicaciones.data);
      } catch (err) {
        console.error("Error al cargar la información del perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveName = async () => {
    try {
      const res = await api.put("/api/v1/usuarios/perfil", { nombre });
      setPerfil(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al actualizar el nombre");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("archivo", e.target.files[0]);

      try {
        const res = await api.post("/api/v1/usuarios/perfil/foto", formData);
        setPerfil((prev) => prev ? { ...prev, fotoPerfil: res.data.fotoPerfil } : null);
      } catch (err) {
        console.error("Error al subir foto:", err);
      }
    }
  };

  if (loading) return <div className="text-center p-10 dark:text-white">Cargando perfil...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* TARJETA DE INFORMACIÓN DEL PERFIL */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
        <h1 className="text-2xl font-black mb-6 text-slate-900 dark:text-white">Mi Perfil</h1>
        
        {perfil && (
          <div className="flex flex-col items-center gap-4">
            
            {/* FOTO DE PERFIL */}
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-slate-100 dark:border-slate-800">
                {perfil.fotoPerfil ? (
                  <img src={perfil.fotoPerfil} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Editar</div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                Cambiar
              </div>
            </div>
            
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            {/* NOMBRE EDITABLE */}
            <div className="text-center w-full">
              {isEditing ? (
                <div className="flex flex-col items-center gap-2">
                  <input 
                    type="text"
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)}
                    className="px-3 py-1 border rounded text-lg font-bold text-center dark:bg-slate-800 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSaveName} 
                      className="text-xs bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
                    >
                      Guardar
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)} 
                      className="text-xs bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-slate-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <h2 onClick={() => setIsEditing(true)} className="text-xl font-bold text-slate-900 dark:text-white cursor-pointer hover:text-teal-600 transition-colors">
                  {perfil.nombre} <span className="text-sm opacity-50">✎</span>
                </h2>
              )}
              <p className="text-gray-600 dark:text-gray-400 mt-1">{perfil.correo}</p>
            </div>

            {/* ROLES */}
            <div className="mt-2">
              <span className="text-xs font-semibold uppercase text-gray-500">Roles:</span>
              <div className="flex gap-2 mt-1 justify-center">
                {perfil.roles.map(rol => (
                  <span key={rol} className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-xs">
                    {rol}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECCIÓN DE MIS PUBLICACIONES (USANDO EL COMPONENTE REUTILIZABLE) */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Mis Publicaciones</h2>
        
        <FeedPublicaciones 
          publicaciones={publicaciones} 
          onExpandImage={setImagenExpandida}
          mensajeVacio="Aún no has compartido ningún lugar en Buenaventura. ¡Anímate a publicar uno!"
        />
      </div>

      {/* MODAL PARA VER IMAGEN EN TAMAÑO REAL */}
      {imagenExpandida && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setImagenExpandida(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img src={imagenExpandida} alt="Ampliada" className="max-w-full max-h-full object-contain rounded-lg" />
            <button 
              className="absolute top-4 right-4 bg-white/20 text-white rounded-full p-2 hover:bg-white/40 transition"
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