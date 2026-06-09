'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RecuperarClavePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [nuevaClave, setNuevaClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Falta el parámetro de verificación obligatorio o el enlace está corrupto.');
    }
  }, [token]);

  const handleRestablecer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (nuevaClave !== confirmarClave) {
      setError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    if (nuevaClave.length < 8) {
      setError('La contraseña de seguridad debe contener mínimo 8 caracteres.');
      return;
    }

    setCargando(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/restablecer-clave/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, nuevaClave }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al intentar redefinir la clave.');
      }

      setExito(true);
      setTimeout(() => router.push('/login'), 3500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md border border-red-100 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Petición Inválida</h2>
          <p className="text-gray-600 text-sm">{error || 'Acceso restringido.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Restablecer Credenciales</h2>

        {exito ? (
          <div className="rounded-md bg-green-50 p-4 border border-green-200 text-center">
            <p className="text-sm font-medium text-green-800">¡Contraseña cambiada exitosamente!</p>
            <p className="text-xs text-green-600 mt-1">Redirigiendo de forma segura a la pantalla de login...</p>
          </div>
        ) : (
          <form onSubmit={handleRestablecer} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
              <input
                type="password"
                required
                value={nuevaClave}
                onChange={(e) => setNuevaClave(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                required
                value={confirmarClave}
                onChange={(e) => setConfirmarClave(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-2 px-4 rounded-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 transition-colors"
            >
              {cargando ? 'Modificando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}