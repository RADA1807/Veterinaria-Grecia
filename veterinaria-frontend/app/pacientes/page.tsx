'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import PacienteCard from './components/PacienteCard';
import Link from 'next/link';

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

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

 const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token'); // 👈 ahora coincide con el login
  }
  return null;
};

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const token = getToken();
        const res = await fetch('http://localhost:3001/api/pacientes', {
          headers: {
            Authorization: `Bearer ${token ?? ''}`,
          },
        });

        if (!res.ok) throw new Error('Respuesta no OK');

        const data = await res.json();
        setPacientes(data);
      } catch (err) {
        console.error('❌ Error al cargar pacientes:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Lista de Pacientes</h1>

        <div className="text-center mb-6">
          <Link
            href="/pacientes/nuevo"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            ➕ Nuevo paciente
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-semibold">
            No se pudo cargar la lista de pacientes.
          </div>
        ) : pacientes.length === 0 ? (
          <div className="text-center text-gray-600 italic">
            No hay pacientes registrados.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientes.map((paciente) => (
              <PacienteCard key={paciente.id} paciente={paciente} />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}