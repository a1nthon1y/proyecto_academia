'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

/**
 * Página principal del ADMIN - Redirige automáticamente a gestión de usuarios
 * Mejora UX: El admin ve primero lo más importante (gestión de usuarios del sistema)
 * Según historia de usuario #7: ADMIN – Gestión de Usuarios
 */
export default function AdminDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirigir automáticamente a la página de gestión de usuarios
    router.replace('/usuarios');
  }, [router]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-slate-600">Redirigiendo...</p>
      </div>
    </DashboardLayout>
  );
}

