"use client";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import ModalPublicar from "@/components/publicaciones/ModalPublicar";

export default function Navbar() {
  const { usuario, logout } = useAuthStore();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [postIdCreado, setPostIdCreado] = useState<number | null>(null); // Estado para guardar el ID

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    logout();
    router.push("/login");
  };

  const handlePublicacionExitosas = (idPublicacion: number) => {
    setPostIdCreado(idPublicacion);
    setMostrarToast(true);
    router.refresh(); 
  };

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
        <Link href="/" className="font-black text-xl text-[hsl(174_72%_40%)] tracking-wider">
          TuraTrip
        </Link>
        
        <div className="flex items-center gap-4">
          {usuario ? (
            <>
              <Link 
                href="/perfil" 
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 flex-shrink-0">
                  {usuario.fotoPerfil ? (
                    <img src={usuario.fotoPerfil} alt={usuario.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                      {usuario.nombre?.[0] || "U"}
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 hidden sm:inline">
                  {usuario.nombre}
                </span>
              </Link>

              {/* BOTÓN QUE ABRE EL MODAL FLOTANTE */}
              <button
                onClick={() => setIsModalOpen(true)}
                title="Publicar un lugar"
                className="flex items-center justify-center w-9 h-9 bg-[hsl(174_72%_40%)] text-white rounded-full shadow-md hover:opacity-90 transition transform hover:scale-105 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>

              <button 
                onClick={handleLogout} 
                className="text-red-500 text-xs font-semibold hover:underline px-2 py-1"
              >
                Salir
              </button>
            </>
          ) : (
            <Link 
              href="/login" 
              className="bg-[hsl(174_72%_40%)] text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition shadow-sm"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>

      {/* MODAL DE CREACIÓN */}
      <ModalPublicar 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handlePublicacionExitosas} 
      />

      {/* TOAST FLOTANTE */}
      {mostrarToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="text-sm font-medium">¡Tu post se envió con éxito!</span>
          <button 
            onClick={() => {
              setMostrarToast(false);
              if (postIdCreado) {
                router.push(`/publicaciones/${postIdCreado}`); // Redirige exactamente al detalle del post
              }
            }}
            className="bg-[hsl(174_72%_40%)] hover:bg-[hsl(174_72%_35%)] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            Ver
          </button>
        </div>
      )}
    </>
  );
}