'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PacienteForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    paciente: {
      nombre: '',
      especie: '',
      raza: '',
      edad: '',
      historial_medico: '',
    },
    propietario: {
      nombre: '',
      telefono: '',
      correo: '',
      direccion: '',
    },
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const [grupo, campo] = name.split('.');

    setForm((prev) => ({
      ...prev,
      [grupo]: {
        ...prev[grupo as 'paciente' | 'propietario'],
        [campo]: value,
      },
    }));

    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1️⃣ Registrar propietario
      const propietarioRes = await fetch('http://localhost:3001/api/propietarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.propietario),
      });

      const propietarioData = await propietarioRes.json();

      if (!propietarioRes.ok) {
        throw new Error(propietarioData.error || 'Error al registrar propietario');
      }

      const propietario_id = propietarioData.propietarioId;

      // 2️⃣ Registrar paciente con el ID del propietario
      const pacienteRes = await fetch('http://localhost:3001/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form.paciente,
          edad: Number(form.paciente.edad),
          propietario_id,
        }),
      });

      const pacienteData = await pacienteRes.json();

      if (!pacienteRes.ok) {
        throw new Error(pacienteData.error || 'Error al registrar paciente');
      }

      setSuccess('✅ Propietario y paciente registrados correctamente');
      setForm({
        paciente: {
          nombre: '',
          especie: '',
          raza: '',
          edad: '',
          historial_medico: '',
        },
        propietario: {
          nombre: '',
          telefono: '',
          correo: '',
          direccion: '',
        },
      });

      setTimeout(() => {
        router.push('/pacientes');
      }, 2000);
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Error desconocido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Registrar propietario y paciente</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}

      <h3 className="text-lg font-semibold mb-2">Datos del propietario</h3>
      {['nombre', 'telefono', 'correo', 'direccion'].map((field) => (
        <input
          key={field}
          type="text"
          name={`propietario.${field}`}
          value={form.propietario[field as keyof typeof form.propietario]}
          onChange={handleChange}
          placeholder={field}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          required={field === 'nombre'}
        />
      ))}

      <h3 className="text-lg font-semibold mt-6 mb-2">Datos del paciente</h3>
      {['nombre', 'especie', 'raza', 'edad'].map((field) => (
        <input
          key={field}
          type="text"
          name={`paciente.${field}`}
          value={form.paciente[field as keyof typeof form.paciente]}
          onChange={handleChange}
          placeholder={field}
          className="w-full mb-3 p-2 border border-gray-300 rounded"
          required
        />
      ))}

      <textarea
        name="paciente.historial_medico"
        value={form.paciente.historial_medico}
        onChange={handleChange}
        placeholder="Historial médico"
        className="w-full mb-3 p-2 border border-gray-300 rounded"
        required
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Registrar
      </button>
    </form>
  );
}