'use client';

import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import PacienteEdit from '@/app/pacientes/components/PacienteEdit';
import { useParams } from 'next/navigation';

export default function EditPacientePage() {
  const { id } = useParams(); // 👈 obtiene el UUID directamente de la URL

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Editar paciente</h1>
        {id && <PacienteEdit pacienteId={id} />}
      </div>
    </ProtectedRoute>
  );
}
