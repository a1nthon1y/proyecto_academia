'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import { LoadingSpinner } from '@/components/LoadingSpinner';

/**
 * La ruta /login ya no tiene UI propia: el login es un modal sobre la
 * landing (/). Este archivo solo redirige a la home con ?login=1 para
 * que el modal se abra automáticamente. Mantenemos la ruta para que
 * todos los enlaces legacy (logout, expiración de token, AuthGuard, …)
 * sigan funcionando sin tocarlos.
 */
export default function LoginRedirectPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useStore();

  useEffect(() => {
    if (isAuthenticated && user?.rol_id) {
      // Ya autenticado → al dashboard que le corresponde
      import('@/utils/roles').then(({ getRouteByRolId }) => {
        router.replace(getRouteByRolId(user.rol_id));
      });
    } else {
      router.replace('/?login=1');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700">
      <LoadingSpinner />
    </div>
  );
}
