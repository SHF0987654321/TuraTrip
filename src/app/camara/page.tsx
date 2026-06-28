"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function CameraPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const startCamera = async () => {
    setError(null);
    setLoading(true);

    if (stream) {
      stopCamera();
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este navegador no admite acceso a la cámara.");
      setLoading(false);
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {
          /* Algunos navegadores requieren iniciar manualmente la reproducción */
        });
      }

      setStream(mediaStream);
    } catch (err) {
      console.error(err);
      setError(
        "No se pudo acceder a la cámara. Revisa los permisos y vuelve a intentarlo."
      );
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    // aplaza el inicio de la cámara para evitar llamar setState de forma síncrona dentro del effect
    const startTimer = window.setTimeout(() => startCamera(), 0);

    return () => {
      clearTimeout(startTimer); // cancela el inicio pendiente si el componente se desmonta antes
      stopCamera(); // detiene cualquier stream activo cuando el effect hace cleanup
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      setError("No se pudo preparar la captura de imagen.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setPhoto(dataUrl);
    stopCamera();
  };

  const retryCapture = () => {
    setPhoto(null);
    setError(null);
    setSuccess(false);
    startCamera();
  };

  const cancelCapture = () => {
    stopCamera();
    setPhoto(null);
    setError(null);
    setSuccess(false);
    router.push("/");
  };

  const publishPhoto = async () => {
    if (!photo) return;
    setUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/publicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo }),
      });

      if (!response.ok) {
        throw new Error("Error al publicar la imagen.");
      }

      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError(
        "Ocurrió un problema al subir la foto. Verifica tu conexión y vuelve a intentarlo."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-[hsl(210_15%_80%)] bg-white p-6 shadow-lg shadow-slate-200/50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Tomar foto
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Captura tu momento y compártelo.
            </h1>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Volver al inicio
          </Link>
        </div>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Como usuario, quiero tomar una foto desde la app para compartir contenido de lugares.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-700/60 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-6 text-slate-900 dark:border-green-700/60 dark:bg-emerald-950/30 dark:text-green-100">
            <h2 className="text-xl font-semibold">¡Publicación exitosa!</h2>
            <p className="mt-2 text-sm leading-6">
              Tu foto se publicó correctamente. Ahora puedes regresar al flujo de la publicación.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-4 inline-flex rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Regresar al inicio
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-3xl bg-slate-950 text-slate-100 shadow-xl shadow-slate-500/10">
              {photo ? (
                <div className="relative aspect-video bg-slate-900">
                  <img
                    src={photo}
                    alt="Vista previa de la foto tomada"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative aspect-video bg-black">
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  {!stream && !loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-center px-4 text-sm text-slate-100">
                      {loading
                        ? "Solicitando permisos de cámara..."
                        : "Permite el acceso a la cámara para comenzar."}
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold">Tus acciones</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Usa la cámara para capturar una imagen, revisa la vista previa y elige si deseas aceptar, repetir o cancelar.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                {!photo ? (
                  <>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!stream || loading}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Tomar foto
                    </button>
                    <button
                      type="button"
                      onClick={startCamera}
                      disabled={loading}
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Reintentar cámara
                    </button>
                    <button
                      type="button"
                      onClick={cancelCapture}
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-transparent bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={publishPhoto}
                      disabled={uploading}
                      className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {uploading ? "Publicando..." : "Aceptar y publicar"}
                    </button>
                    <button
                      type="button"
                      onClick={retryCapture}
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      Repetir captura
                    </button>
                    <button
                      type="button"
                      onClick={cancelCapture}
                      className="inline-flex w-full items-center justify-center rounded-2xl border border-transparent bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
                <p className="font-semibold">Criterios de aceptación</p>
                <ul className="mt-2 space-y-2 text-slate-600 dark:text-slate-300">
                  <li>Accede a la cámara y solicita permisos.</li>
                  <li>Vista previa antes de aceptar o repetir.</li>
                  <li>Regresa al flujo de publicación luego de aceptar.</li>
                  <li>Muestra mensaje de error si falla la publicación.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
