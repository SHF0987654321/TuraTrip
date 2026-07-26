import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "";

  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

/**
 * Normaliza cualquier URL de imagen enviada por Spring Boot
 * para utilizar la ruta del proxy rewrite de Next.js (/backend-uploads)
 */
export function getProxyImageUrl(url?: string | null): string | null {
  if (!url) return null;

  // Si ya tiene el formato proxy relativo
  if (url.startsWith("/backend-uploads")) return url;

  // Si viene como URL absoluta (ej: http://localhost:8080/uploads/foto.jpg)
  if (url.startsWith("http")) {
    return url.replace(/http:\/\/[^\/]+\/uploads/, "/backend-uploads");
  }

  // Si viene como ruta relativa (ej: /uploads/foto.jpg)
  if (url.startsWith("/uploads")) {
    return url.replace("/uploads", "/backend-uploads");
  }

  return url;
}
