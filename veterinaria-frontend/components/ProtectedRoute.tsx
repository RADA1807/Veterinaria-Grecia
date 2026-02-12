'use client';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  useAuthGuard(); // ✅ activa la verificación de sesión

  return <>{children}</>;
}