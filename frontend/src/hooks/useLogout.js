import { useCallback } from 'react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export const useLogout = () => {
  const logout = useCallback(() => {
    try {
      // Limpiar localStorage
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

  return { logout };
};
