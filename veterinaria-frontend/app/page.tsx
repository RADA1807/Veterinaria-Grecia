import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Encabezado arriba */}
      <div className="text-center mt-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido al sistema de la Veterinaria Grecia
        </h1>
      </div>

      {/* Texto + botón centrados */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <p className="text-gray-700 mb-6 text-center">
          Para acceder al sistema debes iniciar sesión.
        </p>
        <Link
          href="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Ir al Login
        </Link>
      </div>
    </main>
  );
}