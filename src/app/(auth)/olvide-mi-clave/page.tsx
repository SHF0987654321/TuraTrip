'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function OlvidoClavePage() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/restablecer-clave/solicitar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
      });

      if (!res.ok) {
        throw new Error('No se pudo procesar la solicitud en este momento.');
      }

      // Respuesta deliberadamente ambigua por protección de datos
      setMensaje('Si tu correo electrónico coincide con una cuenta registrada, recibirás un enlace para restablecer tu contraseña en los próximos minutos.');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
      setError(errorMessage);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Introduce tu dirección de correo electrónico institucional o de registro.
          </p>
        </div>

        {mensaje ? (
          <div className="rounded-md bg-teal-50 p-4 border border-teal-200">
            <p className="text-sm text-teal-800 text-center font-medium">{mensaje}</p>
            <div className="mt-4 text-center">
              <Link href="/login" className="text-sm font-semibold text-teal-600 hover:text-teal-500">
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-3 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
                placeholder="ejemplo@turatrip.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={cargando}
                className="group relative flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700 focus:outline-none focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-50 transition-colors"
              >
                {cargando ? 'Procesando...' : 'Enviar enlace de restauración'}
              </button>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Cancelar y regresar
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
