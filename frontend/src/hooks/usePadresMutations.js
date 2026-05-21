import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  registrarPadreCompleto,
  actualizarPadreCompleto,
  desactivarPadre,
  reactivarPadre,
} from '@/services/padresServiceTrabajador';
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

// Hook para desactivar padre (soft delete)
export const useDesactivarPadre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => desactivarPadre(id),
    onSuccess: (data) => {
      const activas = data?.matriculas_activas || 0;
      if (activas > 0) {
        toast.success(`Padre desactivado. ⚠️ Tiene ${activas} hijo(s) con matrícula activa — revísalo.`, { duration: 6000 });
      } else {
        toast.success('Padre desactivado correctamente');
      }
      queryClient.invalidateQueries({ queryKey: ['padres', 'trabajador'] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al desactivar padre');
    }
  });
};

// Hook para reactivar padre
export const useReactivarPadre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => reactivarPadre(id),
    onSuccess: () => {
      toast.success('Padre reactivado correctamente');
      queryClient.invalidateQueries({ queryKey: ['padres', 'trabajador'] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al reactivar padre');
    }
  });
};

// Alias retro-compatible
export const useEliminarPadre = useDesactivarPadre;
