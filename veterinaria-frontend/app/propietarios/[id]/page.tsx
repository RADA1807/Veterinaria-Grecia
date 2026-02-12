'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PropietarioDetalle() {
  const { id } = useParams();
  const router = useRouter();
  const [propietario, setPropietario] = useState<any>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    fetch(`http://localhost:3001/api/propietarios/${id}`, {
      headers: { Authorization: `Bearer ${token ?? ''}` },
    })
      .then((res) => res.json())
      .then((data) => setPropietario(data))
      .catch((err) => console.error('❌ Error al cargar propietario:', err));
  }, [id]);

  if (!propietario) {
    return <div className="p-4">Cargando propietario...</div>;
  }

  const mascotas = propietario.nombres_mascotas
    ? propietario.nombres_mascotas.split(',').map((m: string) => m.trim())
    : [];

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="flex justify-center mt-10 px-4">
        <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
            Detalle de Propietario
          </h2>

          <div className="space-y-3 text-gray-700">
            <p><span className="font-semibold">Nombre:</span> {propietario.nombre}</p>
            <p><span className="font-semibold">Teléfono:</span> {propietario.telefono}</p>
            <p><span className="font-semibold">Correo:</span> {propietario.correo}</p>
            <p><span className="font-semibold">Dirección:</span> {propietario.direccion}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Mascotas</h3>
            {mascotas.length === 0 ? (
              <p className="text-gray-500">—</p>
            ) : mascotas.length === 1 ? (
              <p className="text-gray-700">{mascotas[0]}</p>
            ) : (
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                {mascotas.map((m: string, idx: number) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => router.back()}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              ← Volver
            </button>
            <button
              onClick={() => router.push('/propietarios')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Lista de propietarios
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
