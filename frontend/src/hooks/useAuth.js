import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(() => {
    try {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getUser();
      
      setIsAuthenticated(authenticated);
      setUser(currentUser);
      
      return authenticated;
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      // Limpiar estado local primero
      setIsAuthenticated(false);
      setUser(null);
      
      // Luego limpiar localStorage
      authService.logout();
      
      toast.success('Sesión cerrada correctamente');
      
      // Usar window.location.href para evitar conflictos con Next.js router
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error al cerrar sesión');
    }
  }, []);

  useEffect(() => {
    // Verificar autenticación inicial
    checkAuth();
    setIsLoading(false);
  }, [checkAuth]);

  return {
    isAuthenticated,
    user,
    isLoading,
    logout,
    checkAuth
  };
};
