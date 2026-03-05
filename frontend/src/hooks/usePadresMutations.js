import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registrarPadreCompleto, actualizarPadreCompleto, eliminarPadre } from '@/services/padresServiceTrabajador';
import { toast } from 'sonner';

// Hook para registrar padre completo (usuario + perfil)
export const useRegistrarPadreCompleto = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: registrarPadreCompleto,
    onSuccess: (data) => {
      toast.success('Padre registrado correctamente');
      queryClient.invalidateQueries({ queryKey: ['padres', 'trabajador'] });
      return data; // Retorna los datos incluyendo credenciales
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al registrar padre');
    },
  });

  return mutation;
};

// Hook para actualizar padre completo
export const useActualizarPadreCompleto = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }) => actualizarPadreCompleto(id, data),
    onSuccess: () => {
      toast.success('Padre actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['padres', 'trabajador'] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al actualizar padre');
    },
  });

  return mutation;
};

// Hook para eliminar padre
export const useEliminarPadre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => eliminarPadre(id),
    onSuccess: () => {
      toast.success('Padre eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['padres', 'trabajador'] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al eliminar padre');
    }
  });
};
