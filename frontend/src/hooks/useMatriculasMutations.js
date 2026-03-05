import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearMatricula, actualizarMatricula, cambiarEstadoMatricula, eliminarMatricula } from '@/services/matriculasService';
import { toast } from 'sonner';

// Hook para crear matrícula
export const useCrearMatricula = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: crearMatricula,
    onSuccess: () => {
      toast.success('Matrícula creada correctamente');
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
      queryClient.invalidateQueries({ queryKey: ['padre', 'mis-tutores'] }); // Actualizar tutores del padre
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al crear matrícula');
    },
  });

  return mutation;
};

// Hook para actualizar matrícula
export const useActualizarMatricula = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }) => actualizarMatricula(id, data),
    onSuccess: () => {
      toast.success('Matrícula actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
      queryClient.invalidateQueries({ queryKey: ['padre', 'mis-tutores'] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al actualizar matrícula');
    },
  });

  return mutation;
};

// Hook para cambiar estado de matrícula
export const useCambiarEstadoMatricula = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }) => cambiarEstadoMatricula(id, estado),
    onSuccess: () => {
      toast.success('Estado de matrícula actualizado');
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al cambiar estado');
    },
  });
};

// Hook para eliminar matrícula (SOLO ADMIN)
export const useEliminarMatricula = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eliminarMatricula,
    onSuccess: () => {
      toast.success('Matrícula eliminada permanentemente');
      queryClient.invalidateQueries({ queryKey: ['matriculas'] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al eliminar matrícula');
    },
  });
};
