'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { TokenExpirationAlert } from '@/components/common/TokenExpirationAlert';
import { toast } from 'sonner';
import { hasAccessToRoute, getRouteByRolId } from '@/utils/roles';

export function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authenticated = authService.isAuthenticated();
        const currentUser = authService.getUser();
        
        setIsAuthenticated(authenticated);
        setUser(currentUser);
        setIsLoading(false);

        if (!authenticated) {
          router.push('/login');
          return;
        }

        // Verificar permisos de la ruta usando rol_id numérico
        const rolId = currentUser?.rol_id;
        if (rolId && !hasAccessToRoute(rolId, pathname)) {
          toast.error('No tienes permisos para acceder a esta página');
          
          // Redirigir al panel principal según el rol_id
          const fallbackRoute = getRouteByRolId(rolId);
          router.push(fallbackRoute);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        router.push('/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Si no está autenticado, no mostrar el layout
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <TokenExpirationAlert />
      <div className="flex h-screen bg-gray-100 lg:flex-row flex-col">
        <Sidebar user={user} />

        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Header user={user} />

          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

