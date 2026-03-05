'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

/**
 * Página principal del TRABAJADOR - Redirige automáticamente a control de asistencias
 * Mejora UX: El trabajador ve primero lo más importante (control de asistencias)
 * Alternativa: Podría redirigir a /trabajador/consultas si las consultas son más prioritarias
 */
export default function TrabajadorDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a la página de control de asistencias
    router.replace('/trabajador/asistencias');
  }, [router]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-slate-600">Redirigiendo...</p>
      </div>
    </DashboardLayout>
  );
}

