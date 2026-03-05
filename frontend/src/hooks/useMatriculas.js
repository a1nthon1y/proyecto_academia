import { useQuery } from '@tanstack/react-query';
import { listarMatriculas, obtenerMatricula } from '@/services/matriculasService';

// Hook para listar todas las matrículas
export const useMatriculas = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['matriculas'],
    queryFn: listarMatriculas,
  });

  return {
    matriculas: data || [],
    isLoading,
    isError,
    refetch,
  };
};

// Hook para obtener una matrícula específica
export const useMatricula = (id) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['matriculas', id],
    queryFn: () => obtenerMatricula(id),
    enabled: !!id,
  });

  return {
    matricula: data,
    isLoading,
    isError,
    refetch,
  };
};
