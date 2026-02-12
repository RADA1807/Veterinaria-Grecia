'use client';

import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import PacienteForm from '@/app/pacientes/components/PacienteForm';

export default function NuevoPacientePage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Registrar nuevo paciente</h1>
        <PacienteForm />
      </div>
    </ProtectedRoute>
  );
}