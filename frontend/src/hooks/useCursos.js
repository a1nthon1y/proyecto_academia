import { useQuery } from '@tanstack/react-query';
import { listarCursos } from '@/services/cursosService';

// Hook para listar todos los cursos
export const useCursos = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['cursos'],
    queryFn: listarCursos,
  });

  return {
    cursos: data || [],
    isLoading,
    isError,
    refetch,
  };
};
