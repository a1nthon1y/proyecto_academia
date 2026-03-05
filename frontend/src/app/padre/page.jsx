'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

/**
 * Página principal del PADRE - Redirige automáticamente a asistencias
 * Mejora UX: El padre ve primero lo más importante (marcar asistencia)
 */
export default function PadreDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a la página de asistencias
    router.replace('/padre/asistencias');
  }, [router]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-slate-600">Redirigiendo...</p>
      </div>
    </DashboardLayout>
  );
}

