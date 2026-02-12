import Link from 'next/link';

type Paciente = {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  historial_medico: string;
  propietario_id: string;
};

export default function PacienteCard({ paciente }: { paciente: Paciente }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{paciente.nombre}</h2>
      <p className="text-sm text-gray-600">🐾 {paciente.especie} - {paciente.raza}</p>
      <p className="text-sm text-gray-600">🎂 Edad: {paciente.edad} años</p>
      <p className="text-sm text-gray-600 mt-2">📝 Historial: {paciente.historial_medico}</p>

      <div className="mt-4 text-right">
        <Link
          href={`/pacientes/${paciente.id}`} // 👈 aquí va el UUID correcto
          className="inline-block bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}
