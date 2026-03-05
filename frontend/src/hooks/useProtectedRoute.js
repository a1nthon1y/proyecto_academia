import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export const useProtectedRoute = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Solo verificar una vez
    if (hasChecked.current) return;
    
    const checkAuth = () => {
      try {
        const authenticated = authService.isAuthenticated();
        const currentUser = authService.getUser();
        
        setIsAuthenticated(authenticated);
        setUser(currentUser);
        setIsLoading(false);
        hasChecked.current = true;

        // Solo redirigir si no está autenticado y no estamos ya en login
        if (!authenticated && 
            typeof window !== 'undefined' && 
            window.location.pathname !== '/login') {
          toast.error('Sesión no válida. Por favor, inicie sesión.');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        hasChecked.current = true;
        
        if (typeof window !== 'undefined' && 
            window.location.pathname !== '/login') {
          toast.error('Error de autenticación. Por favor, inicie sesión.');
          router.push('/login');
        }
      }
    };

    checkAuth();
  }, [router]);

  return {
    isAuthenticated,
    user,
    isLoading
  };
};
