'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

type Propietario = {
  id: string;
  nombre: string;
  telefono: string;
  correo: string;
  direccion: string;
  cantidad_pacientes: number;
  nombres_mascotas: string | null;
};

export default function PropietariosPage() {
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [search, setSearch] = useState('');
  const [limit] = useState(5);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token'); // 👈 igual que en login
    }
    return null;
  };

  const fetchPropietarios = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('nombre', search);
      params.append('limit', String(limit));
      params.append('offset', String(offset));

      const token = getToken();
      const res = await fetch(`http://localhost:3001/api/propietarios?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token ?? ''}` }, // 👈 token en GET
      });

      console.log('Respuesta propietarios:', res.status, res.statusText);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Backend devolvió:', errorText);
        throw new Error('Error al cargar propietarios');
      }

      const data = await res.json();
      setPropietarios(data);
    } catch (err) {
      console.error('❌ Error al cargar propietarios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropietarios();
  }, [search, offset]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    fetchPropietarios();
  };

  const handleAnterior = () => {
    if (offset >= limit) setOffset(offset - limit);
  };

  const handleSiguiente = () => {
    if (propietarios.length === limit) setOffset(offset + limit);
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center sm:text-left">
          Gestión de Propietarios
        </h1>
        <p className="text-gray-600 text-sm mb-6 text-center sm:text-left">
          Aquí podrás registrar, editar, eliminar y buscar propietarios vinculados a sus pacientes.
        </p>

        <form
          onSubmit={handleBuscar}
          className="mb-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto sm:mx-0"
        >
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Buscar
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded shadow text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 whitespace-nowrap">Nombre</th>
                <th className="text-left p-3 whitespace-nowrap">Teléfono</th>
                <th className="text-left p-3 whitespace-nowrap">Correo</th>
                <th className="text-left p-3 whitespace-nowrap">Dirección</th>
                <th className="text-left p-3 whitespace-nowrap">Mascotas</th>
                <th className="text-left p-3 whitespace-nowrap">Nombres</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : propietarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No se encontraron propietarios.
                  </td>
                </tr>
              ) : (
                propietarios.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.nombre}</td>
                    <td className="p-3">{p.telefono}</td>
                    <td className="p-3">{p.correo}</td>
                    <td className="p-3">{p.direccion}</td>
                    <td className="p-3">{p.cantidad_pacientes}</td>
                    <td className="p-3">{p.nombres_mascotas || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleAnterior}
            disabled={offset === 0}
            className={`px-4 py-2 rounded ${
              offset === 0
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            ← Anterior
          </button>
          <button
            onClick={handleSiguiente}
            disabled={propietarios.length < limit}
            className={`px-4 py-2 rounded ${
              propietarios.length < limit
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
