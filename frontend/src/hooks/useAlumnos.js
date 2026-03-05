import { useQuery } from '@tanstack/react-query';
import { listarAlumnos, obtenerAlumno } from '@/services/alumnosService';

// Hook para listar todos los alumnos
export const useAlumnos = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['alumnos'],
    queryFn: listarAlumnos,
  });

  return {
    alumnos: data || [],
    isLoading,
    isError,
    refetch,
  };
};

// Hook para obtener un alumno específico
export const useAlumno = (id) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['alumnos', id],
    queryFn: () => obtenerAlumno(id),
    enabled: !!id,
  });

  return {
    alumno: data,
    isLoading,
    isError,
    refetch,
  };
};
