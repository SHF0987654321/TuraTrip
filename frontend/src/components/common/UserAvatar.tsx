"use client";

interface UserAvatarProps {
  fotoPerfil?: string | null;
  nombre?: string;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({ fotoPerfil, nombre, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400`}
    >
      {fotoPerfil ? (
        <img src={fotoPerfil} alt={nombre || "Usuario"} className="w-full h-full object-cover" />
      ) : (
        <span>{nombre?.[0]?.toUpperCase() || "U"}</span>
      )}
    </div>
  );
}
