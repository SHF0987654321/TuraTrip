import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHashtags(text: string): string {
  if (!text) return "";

  const firstCommaIndex = text.indexOf(",");
  if (firstCommaIndex === -1) return text;

  const description = text.slice(0, firstCommaIndex + 1);
  const tagsPart = text.slice(firstCommaIndex + 1);
  if (!tagsPart) return description;

  let formattedTags = "";
  const regex = /([^,\s]+)|([,\s]+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(tagsPart)) !== null) {
    if (match[1] !== undefined) {
      const token = match[1];
      const nextChar = tagsPart[regex.lastIndex];
      const isCompleted =
        nextChar === "," || nextChar === " " || nextChar === undefined;
      if (isCompleted) {
        formattedTags += `#${token.replace(/^#+/, "")}`;
      } else {
        formattedTags += token;
      }
    } else if (match[2] !== undefined) {
      formattedTags += match[2];
    }
  }

  return `${description}${formattedTags}`;
}

export function formatCommaSeparatedHashtags(text: string): string {
  if (!text) return "";

  const endsWithComma = /,\s*$/.test(text);

  const formatted = text
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((token) => token.replace(/^#+/, ""))
    .map((token) => `#${token.replace(/\s+/g, "")}`)
    .join(" ");

  return endsWithComma ? `${formatted} ` : formatted;
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

  const normalizedUrl = url.trim();

  // Si ya tiene el formato proxy relativo
  if (normalizedUrl.startsWith("/backend-uploads")) return normalizedUrl;

  // Si viene como URL absoluta (ej: http://localhost:8080/uploads/foto.jpg)
  if (normalizedUrl.startsWith("http")) {
    try {
      const parsedUrl = new URL(normalizedUrl);
      const pathname = parsedUrl.pathname;
      const uploadPath = pathname
        .replace(/^\/api\/v1/, "")
        .replace(/^\/uploads\//, "");
      return `/backend-uploads/${uploadPath}`.replace(/\/+/g, "/");
    } catch {
      return normalizedUrl
        .replace(/https?:\/\/[^/]+\/api\/v1\/uploads/, "/backend-uploads")
        .replace(/https?:\/\/[^/]+\/uploads/, "/backend-uploads");
    }
  }

  // Si viene como ruta relativa (ej: /uploads/foto.jpg o /api/v1/uploads/foto.jpg)
  if (normalizedUrl.startsWith("/api/v1/uploads")) {
    return normalizedUrl.replace(/^\/api\/v1\/uploads/, "/backend-uploads");
  }

  if (normalizedUrl.startsWith("/uploads")) {
    return normalizedUrl.replace("/uploads", "/backend-uploads");
  }

  return normalizedUrl;
}
