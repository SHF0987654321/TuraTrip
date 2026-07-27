"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getProxyImageUrl } from "@/lib/utils";

interface UserAvatarProps {
  fotoPerfil?: string | null;
  nombre?: string;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({
  fotoPerfil,
  nombre,
  size = "md",
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Normalizamos la URL usando el helper
  const srcProxy = getProxyImageUrl(fotoPerfil);

  useEffect(() => {
    setHasError(false);
  }, [fotoPerfil]);

  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  const pixelSizes = {
    sm: "28px",
    md: "32px",
    lg: "40px",
  };

  return (
    <div
      className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-gray-200 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-gray-500 dark:text-gray-400`}
    >
      {srcProxy && !hasError ? (
        <Image
          key={srcProxy} // ✅ Forzamos a Next/Image a recrearse si la URL cambia
          src={srcProxy}
          alt={nombre || "Usuario"}
          fill
          sizes={pixelSizes[size]}
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{nombre?.[0]?.toUpperCase() || "U"}</span>
      )}
    </div>
  );
}
