import { useQuery } from '@tanstack/react-query';
import { getMisHijos, getMisAsistencias, getPerfilPadre, getMisTutores } from '@/services/padresService';

// Hook para obtener los hijos del padre autenticado
export const useMisHijos = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['padre', 'mis-hijos'],
    queryFn: getMisHijos,
  });

  return {
    hijos: data || [],
    isLoading,
    isError,
    refetch,
  };
};

// Hook para obtener las asistencias del padre autenticado
export const useMisAsistencias = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['padre', 'mis-asistencias'],
    queryFn: getMisAsistencias,
  });

  return {
    asistencias: data || [],
    isLoading,
    isError,
    refetch,
  };
};

// Hook para obtener el perfil del padre
export const usePerfilPadre = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['padre', 'perfil'],
    queryFn: getPerfilPadre,
  });

  return {
    perfil: data,
    isLoading,
    isError,
    refetch,
  };
};

// Hook para obtener tutores asignados a los hijos del padre (con matrículas activas)
export const useMisTutores = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['padre', 'mis-tutores'],
    queryFn: getMisTutores,
  });

  return {
    tutores: data || [],
    isLoading,
    isError,
    refetch,
  };
};
