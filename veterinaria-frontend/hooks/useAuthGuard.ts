'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthGuard() {
  const router = useRouter();
  const hasRun = useRef(false); // ✅ evita ejecución duplicada

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = sessionStorage.getItem('token'); // ✅ corregido
    const email = sessionStorage.getItem('email'); // ✅ corregido

    if (!token || !email) {
      alert('Tu sesión ha expirado o no está activa. Por favor, iniciá sesión nuevamente.');
      localStorage.clear();
      sessionStorage.clear();
      router.push('/login');
    }
  }, []);
}