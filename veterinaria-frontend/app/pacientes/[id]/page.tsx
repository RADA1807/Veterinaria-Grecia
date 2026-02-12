'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';

type Paciente = {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  historial_medico: string;
  propietario_id: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
};

export default function PacientePage() {
  const router = useRouter();
  const { id } = useParams(); // 👈 obtiene el UUID desde la URL
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Recuperar token guardado en sessionStorage (coincide con login)
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token');
    }
    return null;
  };

  const getPaciente = async (id: string) => {
    if (!id || typeof id !== 'string') return null;

    try {
      const token = getToken();
      const res = await fetch(`http://localhost:3001/api/pacientes/${id}`, {
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${token ?? ''}`,
        },
      });

      if (!res.ok) return null;

      const data = await res.json();
      return data;
    } catch (err) {
      console.error('❌ Error en getPaciente:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (typeof id === 'string') {
        const data = await getPaciente(id);
        setPaciente(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este paciente?');

    if (!confirmDelete || !paciente?.id) return;

    try {
      const token = getToken();
      const res = await fetch(`http://localhost:3001/api/pacientes/${paciente.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token ?? ''}`,
        },
      });

      if (!res.ok) throw new Error('Error al eliminar');

      alert('Paciente eliminado correctamente');
      router.push('/pacientes');
    } catch (err) {
      console.error('❌ Error al eliminar paciente:', err);
      alert('No se pudo eliminar el paciente');
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Detalles del Paciente</h1>

        {loading ? (
          <p className="text-center text-gray-500">Cargando...</p>
        ) : !paciente ? (
          <div className="flex items-center justify-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded max-w-xl text-center">
              <h2 className="text-2xl font-bold mb-2">Paciente no encontrado</h2>
              <p className="text-sm text-gray-800">
                Verificá que el ID sea correcto o que el paciente exista en la base de datos.
              </p>
              <Link
                href="/pacientes"
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                ← Volver a la lista
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
              <h2 className="text-xl font-bold mb-2">{paciente.nombre}</h2>
              <p><strong>Especie:</strong> {paciente.especie}</p>
              <p><strong>Raza:</strong> {paciente.raza}</p>
              <p><strong>Edad:</strong> {paciente.edad} años</p>
              <p><strong>Historial médico:</strong> {paciente.historial_medico}</p>
            </div>

            <div className="text-center mt-6 flex justify-center gap-4">
              <Link
                href={`/pacientes/${paciente.id}/edit`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                ✏️ Editar paciente
              </Link>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                🗑️ Eliminar paciente
              </button>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
