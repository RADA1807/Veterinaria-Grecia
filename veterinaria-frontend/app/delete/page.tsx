'use client';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DeletePage() {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmar = window.confirm(
      '¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    if (!confirmar) return;

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    // 🔐 Validación de sesión antes de enviar
    if (!token || !email) {
      alert('Tu sesión ha expirado o no está activa. Por favor, iniciá sesión nuevamente.');
      localStorage.clear();
      sessionStorage.clear();
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log('Respuesta del backend:', data);

      // 🔁 Redirección si el token está vencido o inválido
      if (res.status === 401 || res.status === 403) {
        alert('Tu sesión ha expirado. Por favor, iniciá sesión nuevamente.');
        localStorage.clear();
        sessionStorage.clear();
        router.push('/login');
        return;
      }

      // ✅ Eliminación exitosa
      if (res.ok) {
        alert('✅ Usuario eliminado correctamente');
        localStorage.clear();
        sessionStorage.clear();
        router.push('/register');
      } else {
        alert(`❌ Error: ${data.message || data.error}`);
      }
    } catch (err) {
      console.error('❌ Error al conectar con el backend:', err);
      alert('Error de conexión con el servidor');
    }
  };

  return (
  <ProtectedRoute>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Eliminar Usuario</h2>
        <button
          onClick={handleDelete}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Eliminar Cuenta
        </button>
      </div>
    </div>
  </ProtectedRoute>
);
}