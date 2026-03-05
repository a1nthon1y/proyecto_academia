import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearAlumno, actualizarAlumno, eliminarAlumno } from '@/services/alumnosService';
import { toast } from 'sonner';

// Hook para crear alumno
export const useCrearAlumno = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: crearAlumno,
    onSuccess: () => {
      toast.success('Alumno creado correctamente');
      queryClient.invalidateQueries({ queryKey: ['alumnos'] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al crear alumno');
    },
  });

  return mutation;
};

// Hook para actualizar alumno
export const useActualizarAlumno = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }) => actualizarAlumno(id, data),
    onSuccess: () => {
      toast.success('Alumno actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['alumnos'] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al actualizar alumno');
    },
  });

  return mutation;
};

// Hook para eliminar alumno
export const useEliminarAlumno = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => eliminarAlumno(id),
    onSuccess: () => {
      toast.success('Alumno eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['alumnos'] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al eliminar alumno');
    }
  });
};
