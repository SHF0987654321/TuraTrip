import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.image) {
      return NextResponse.json(
        { message: "Se requiere una imagen para publicar." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Publicación exitosa." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Error al procesar la publicación." },
      { status: 500 }
    );
  }
}
