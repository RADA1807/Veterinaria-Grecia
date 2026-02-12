'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    const storedNombre = sessionStorage.getItem('nombre');
    const storedEmail = sessionStorage.getItem('email');
    const storedTelefono = sessionStorage.getItem('telefono');

    if (storedNombre) setNombre(storedNombre);
    if (storedEmail) setEmail(storedEmail);
    if (storedTelefono) setTelefono(storedTelefono);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token'); // ✅ corregido

    if (!token) {
      alert('Sesión expirada. Iniciá sesión nuevamente.');
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

      if (res.ok) {
        // ✅ Actualizar sessionStorage
        sessionStorage.setItem('nombre', data.nombre || nombre);
        sessionStorage.setItem('email', data.email || email);
        sessionStorage.setItem('telefono', data.telefono || telefono);

        alert('✅ Perfil actualizado correctamente');
        setModoEdicion(false);
        router.refresh();
      } else {
        alert(`❌ Error: ${data.message || data.error}`);
      }
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Mi Perfil</h2>

          {!modoEdicion ? (
            <>
              <p className="mb-4"><strong>Nombre:</strong> {nombre}</p>
              <p className="mb-6"><strong>Correo:</strong> {email}</p>
              <p className="mb-6"><strong>Teléfono:</strong> {telefono}</p>

              <button
                onClick={() => setModoEdicion(true)}
                className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 mb-4"
              >
                ✏️ Editar perfil
              </button>

              <button
                onClick={() => router.push('/delete')}
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                🗑️ Eliminar cuenta
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <label className="block mb-2 text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />

              <label className="block mb-2 text-sm font-medium text-gray-700">Correo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mb-6 p-2 border border-gray-300 rounded"
              />

              <label className="block mb-2 text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                💾 Guardar Cambios
              </button>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}