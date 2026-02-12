'use client';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [nombre, setNombre] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedNombre = localStorage.getItem('nombre');
    if (storedNombre) {
      setNombre(storedNombre);
    }
  }, []);

  const handleLogout = () => {
    const confirmar = window.confirm('¿Deseas cerrar sesión?');

    if (!confirmar) return;

    // 🔐 Limpieza completa
    localStorage.clear();
    sessionStorage.clear();

    // 🔧 Borrar cookies manualmente (por si acaso)
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    // 🚪 Redirección profesional
    router.push('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold tracking-wide">Veterinaria Grecia</div>
        <div className="flex items-center gap-6">
          <span className="text-sm flex items-center gap-2 group">
            <UserCircleIcon className="h-5 w-5 text-white group-hover:text-yellow-300 transition-colors duration-200" />
            Hola{nombre ? `, ${nombre}` : ''}
          </span>
          <Link href="/dashboard" className="hover:underline text-sm">
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 text-sm px-3 py-1 rounded hover:bg-blue-100 transition"
          >
            🔒 Cerrar sesión
          </button>
        </div>
      </nav>
    </header>
  );
}