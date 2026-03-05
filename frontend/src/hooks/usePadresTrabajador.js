import { useQuery } from '@tanstack/react-query';
import { listarPadres } from '@/services/padresServiceTrabajador';

// Hook para listar todos los padres (TRABAJADOR/ADMIN)
export const usePadres = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['padres', 'trabajador'],
    queryFn: listarPadres,
  });

  return {
    padres: data || [],
    isLoading,
    isError,
    refetch,
  };
};
