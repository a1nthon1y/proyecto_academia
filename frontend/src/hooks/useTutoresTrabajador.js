import { useQuery } from '@tanstack/react-query';
import { listarTutores, obtenerTutor } from '@/services/tutoresServiceTrabajador';

// Hook para listar todos los tutores (TRABAJADOR/ADMIN)
export const useTutores = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tutores', 'trabajador'],
    queryFn: listarTutores,
  });

  return {
    tutores: data || [],
    isLoading,
    isError,
    refetch,
  };
};

// Hook para obtener un tutor específico
export const useTutor = (id) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tutores', 'trabajador', id],
    queryFn: () => obtenerTutor(id),
    enabled: !!id,
  });

  return {
    tutor: data,
    isLoading,
    isError,
    refetch,
  };
};
