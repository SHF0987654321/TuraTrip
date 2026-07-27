import PerfilVista from "@/components/perfil/PerfilVista";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PerfilPublicoPage({ params }: PageProps) {
  const { id } = await params;
  const parsedId = Number(id);
  const usuarioId = !isNaN(parsedId) ? parsedId : undefined;

  return <PerfilVista usuarioIdObjetivo={usuarioId} />;
}
