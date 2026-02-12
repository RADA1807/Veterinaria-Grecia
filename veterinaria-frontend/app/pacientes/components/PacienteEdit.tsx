'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Paciente = {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  historial_medico: string;
  propietario_id: string;
};

type Props = {
  pacienteId: string;
};

export default function PacienteEdit({ pacienteId }: Props) {
  const [form, setForm] = useState<Paciente | null>(null);
  const [propietarioNombre, setPropietarioNombre] = useState<string>('Cargando...');
  const router = useRouter();

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token'); // 👈 usar sessionStorage igual que en login
    }
    return null;
  };

  useEffect(() => {
    const fetchPaciente = async () => {
      try {
        const token = getToken();
        const res = await fetch(`http://localhost:3001/api/pacientes/${pacienteId}`, {
          headers: { Authorization: `Bearer ${token ?? ''}` },
        });
        if (!res.ok) throw new Error('Error al cargar paciente');
        const data = await res.json();
        setForm(data);

        // 🔍 Obtener nombre del propietario con token también
        const ownerRes = await fetch(`http://localhost:3001/api/propietarios/${data.propietario_id}`, {
          headers: { Authorization: `Bearer ${token ?? ''}` },
        });
        if (ownerRes.ok) {
          const ownerData = await ownerRes.json();
          setPropietarioNombre(ownerData.nombre);
        } else {
          setPropietarioNombre('Desconocido');
        }
      } catch (err) {
        console.error('Error al cargar paciente:', err);
        alert('No se pudo cargar el paciente');
      }
    };
    fetchPaciente();
  }, [pacienteId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    try {
      const token = getToken();
      const res = await fetch(`http://localhost:3001/api/pacientes/${pacienteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token ?? ''}`, // 👈 token en PUT
        },
        body: JSON.stringify({ ...form, edad: Number(form.edad) }),
      });

      if (res.ok) {
        alert('✅ Paciente actualizado');
        router.push(`/pacientes/${pacienteId}`);
      } else {
        const error = await res.json();
        alert(`❌ Error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error al actualizar paciente:', err);
      alert('❌ No se pudo actualizar el paciente');
    }
  };

  if (!form) return <p className="text-center mt-6">Cargando datos del paciente...</p>;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Editar paciente</h2>

      {['nombre', 'especie', 'raza', 'edad'].map((field) => (
        <input
          key={field}
          type={field === 'edad' ? 'number' : 'text'}
          name={field}
          value={form[field as keyof Paciente]}
          onChange={handleChange}
          placeholder={field}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          required
        />
      ))}

      {/* Mostrar nombre del propietario */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Propietario</label>
        <input
          type="text"
          value={propietarioNombre}
          readOnly
          className="w-full p-2 border border-gray-300 rounded bg-gray-100"
        />
      </div>

      <textarea
        name="historial_medico"
        value={form.historial_medico}
        onChange={handleChange}
        placeholder="Historial médico"
        className="w-full mb-3 p-2 border border-gray-300 rounded"
        required
      />

      {/* Botones de acción */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => router.push('/pacientes')}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          ← Volver
        </button>

        <button
          type="button"
          onClick={() => router.push(`/propietarios/${form.propietario_id}`)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Ver propietario
        </button>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
