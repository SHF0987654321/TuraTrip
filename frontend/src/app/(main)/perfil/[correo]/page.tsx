"use client";
import { useParams } from "next/navigation";
import PerfilVista from "@/components/perfil/PerfilVista";

export default function PerfilPublicoPage() {
  const params = useParams();
  const correoParam = params.correo
    ? decodeURIComponent(params.correo as string)
    : undefined;

  return <PerfilVista correoObjetivo={correoParam} />;
}
