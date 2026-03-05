import { useQuery } from '@tanstack/react-query';
import { getMisAsistenciasTutor, getPerfilTutor } from '@/services/tutoresService';

// Hook para obtener asistencias pendientes del tutor autenticado
// NOTA: El endpoint /api/tutores/mis-asistencias aún no existe en el backend
export const useMisAsistenciasTutor = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tutor', 'mis-asistencias'],
    queryFn: getMisAsistenciasTutor,
    retry: false, // No reintentar si el endpoint no existe aún
    enabled: false, // Deshabilitado por defecto hasta que el backend lo implemente
  });

  return {
    asistencias: data || [],
    isLoading,
    isError,
    refetch,
  };
};

// Hook para obtener el perfil del tutor
export const usePerfilTutor = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tutor', 'perfil'],
    queryFn: getPerfilTutor,
  });

  return {
    perfil: data,
    isLoading,
    isError,
    refetch,
  };
};
