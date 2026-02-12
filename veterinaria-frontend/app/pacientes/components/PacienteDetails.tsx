'use client';
import React from 'react';

type Paciente = {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  historial_medico: string;
  propietario_id: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
};

type Props = {
  paciente: Paciente;
};

export default function PacienteDetails({ paciente }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{paciente.nombre}</h2>
      <ul className="text-sm text-gray-700 space-y-2">
        <li><strong>Especie:</strong> {paciente.especie}</li>
        <li><strong>Raza:</strong> {paciente.raza}</li>
        <li><strong>Edad:</strong> {paciente.edad} años</li>
        <li><strong>Historial médico:</strong> {paciente.historial_medico}</li>
        <li><strong>ID del propietario:</strong> {paciente.propietario_id}</li>
        <li><strong>ID del paciente:</strong> {paciente.id}</li>
        {paciente.fecha_creacion && (
          <li>
            <strong>Fecha de creación:</strong>{' '}
            {new Date(paciente.fecha_creacion).toLocaleDateString()}
          </li>
        )}
        {paciente.fecha_actualizacion && (
          <li>
            <strong>Última actualización:</strong>{' '}
            {new Date(paciente.fecha_actualizacion).toLocaleDateString()}
          </li>
        )}
      </ul>
    </div>
  );
}