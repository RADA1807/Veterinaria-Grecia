'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const [nombre, setNombre] = useState('');
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedNombre = sessionStorage.getItem('nombre');

    if (!token) {
      alert('Tu sesión ha expirado o no está activa. Por favor, inicia sesión nuevamente.');
      router.push('/login');
    } else {
      setValidSession(true);
      if (storedNombre) setNombre(storedNombre);
    }
  }, []);

  if (validSession === null) return null; // Esperar a que se verifique la sesión

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Bienvenido{nombre ? `, ${nombre}` : ''} 👋
        </h1>
        <p className="text-gray-600 mb-6 text-sm text-center">
          Este es tu panel principal. Desde aquí puedes acceder a los módulos del sistema.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/profile')}
            className="bg-blue-100 rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition transform hover:scale-105 hover:shadow-lg"
          >
            <div className="text-4xl mb-2">👤</div>
            <div className="text-lg font-semibold text-gray-800">Perfil</div>
          </button>

          <button
            onClick={() => {
              toast.success('Navegando a Propietarios');
              router.push('/propietarios');
            }}
            className={`rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition transform hover:scale-105 hover:shadow-lg ${
              pathname === '/propietarios'
                ? 'bg-green-300 border-l-4 border-green-600 font-semibold'
                : 'bg-green-100'
            }`}
          >
            <div className="text-4xl mb-2">📋</div>
            <div className="text-lg font-semibold text-gray-800">Propietarios</div>
          </button>

          <button
            onClick={() => {
              toast.success('Navegando a Pacientes');
              router.push('/pacientes');
            }}
            className={`rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition transform hover:scale-105 hover:shadow-lg ${
              pathname === '/pacientes'
                ? 'bg-yellow-300 border-l-4 border-yellow-600 font-semibold'
                : 'bg-yellow-100'
            }`}
          >
            <div className="text-4xl mb-2">🐾</div>
            <div className="text-lg font-semibold text-gray-800">Pacientes</div>
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}