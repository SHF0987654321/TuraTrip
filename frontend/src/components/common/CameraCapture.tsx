"use client";
import { useEffect, useRef, useState } from "react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function CameraCapture({
  onCapture,
  onClose,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileCounterRef = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current && mounted) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err: unknown) {
        console.error(err);
        setError(
          "No se pudo acceder a la cámara. Verifica permisos o dispositivo."
        );
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Re-attach the existing stream to a newly mounted <video> element
  // This fixes the black screen that can happen when the <video> node is
  // unmounted while showing the preview and then remounted on retry.
  useEffect(() => {
    if (!previewDataUrl && streamRef.current && videoRef.current) {
      try {
        videoRef.current.srcObject = streamRef.current;
        // play() may return a promise rejected by autoplay policies; ignore errors
        void videoRef.current.play();
      } catch (e) {
        // swallow errors silently
        console.debug("Could not reattach stream to video element", e);
      }
    }
  }, [previewDataUrl]);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPreviewDataUrl(dataUrl);
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const getNextFileName = () => {
    fileCounterRef.current += 1;
    return `captura_${fileCounterRef.current}.jpg`;
  };

  const accept = () => {
    if (!previewDataUrl) return;
    const file = dataURLtoFile(previewDataUrl, getNextFileName());
    onCapture(file);
    cleanupAndClose();
  };

  const retry = () => {
    setPreviewDataUrl(null);
  };

  const downloadImage = () => {
    if (!previewDataUrl) return;

    const link = document.createElement("a");
    link.href = previewDataUrl;
    link.download = getNextFileName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cleanupAndClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 p-4 relative">
        <button
          onClick={cleanupAndClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Subir publicación desde la cámara
        </h3>

        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

        {!previewDataUrl ? (
          <div className="flex flex-col items-center gap-3">
            <video
              ref={videoRef}
              className="w-full rounded-lg bg-black"
              playsInline
              muted
            />
            <div className="flex gap-3">
              <button
                onClick={capture}
                className="px-4 py-2 bg-[hsl(174_72%_40%)] text-white rounded-xl"
              >
                Capturar
              </button>
              <button
                onClick={cleanupAndClose}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <img
              src={previewDataUrl}
              className="w-full rounded-lg object-contain"
              alt="Previsualización"
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={accept}
                className="px-4 py-2 bg-[hsl(174_72%_40%)] text-white rounded-xl"
              >
                Aceptar
              </button>
              <button
                onClick={downloadImage}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl"
              >
                Descargar imagen
              </button>
              <button
                onClick={retry}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-500 transition"
              >
                Volver a intentarlo
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Si descargas la imagen, puedes usar el selector de archivo para
              subirla después.
            </p>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
