'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';

export default function ProtectedRoute({ children, requiredRole }) {
  const router = useRouter();
  const { isAuthenticated, user, hydrated } = useStore();

  useEffect(() => {
    // Esperar a que el estado esté hidratado
    if (!hydrated) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (requiredRole && user?.rol !== requiredRole) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, user, requiredRole, router, hydrated]);

  // Mostrar loading mientras se hidrata el estado
  if (!hydrated || !isAuthenticated || (requiredRole && user?.rol !== requiredRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return children;
} 