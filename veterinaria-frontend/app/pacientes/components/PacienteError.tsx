'use client';
import React from 'react';

type Props = {
  mensaje?: string;
};

export default function PacienteError({ mensaje }: Props) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-xl mx-auto mt-6">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline ml-2">
        {mensaje || 'No se pudo cargar la lista de pacientes.'}
      </span>
    </div>
  );
}