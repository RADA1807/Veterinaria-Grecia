'use client';
import Link from 'next/link';
import PacienteCard from './PacienteCard';

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
  pacientes: Paciente[];
};

export default function PacienteList({ pacientes }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pacientes.map((paciente) => (
        <Link key={paciente.id} href={`/pacientes/${paciente.id}`}>
          <PacienteCard paciente={paciente} />
        </Link>
      ))}
    </div>
  );
}