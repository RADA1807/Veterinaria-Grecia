'use client';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpdatePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  useEffect(() => {
    setNombre(localStorage.getItem('nombre') || '');
    setEmail(localStorage.getItem('email') || '');
    setTelefono(localStorage.getItem('telefono') || '');
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, email, telefono }),
      });

      const data = await res.json();
      console.log('📦 Respuesta del backend:', data);
      const mensaje = data.message || data.error || 'Error desconocido';

      if (res.ok) {
        alert('Perfil actualizado correctamente');
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('email', email);
        localStorage.setItem('telefono', data.telefono);
        router.push('/dashboard');
      } else {
        alert(`Error al actualizar el perfil: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error('❌ Error en el frontend:', error);
      alert('Error inesperado al actualizar el perfil');
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Editar perfil</h1>

        <label className="block mb-2 text-sm font-medium">Nombre</label>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Tu nombre"
        />

        <label className="block mb-2 text-sm font-medium">Correo</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Tu correo"
        />

        <label className="block mb-2 text-sm font-medium">Teléfono</label>
        <input
          value={telefono}
          onChange={e => setTelefono(e.target.value)}
          className="w-full p-2 border rounded mb-6"
          placeholder="Tu teléfono"
        />

        <button
          onClick={handleUpdate}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition w-full"
        >
          Guardar cambios
        </button>
      </div>
    </ProtectedRoute>
  );
}