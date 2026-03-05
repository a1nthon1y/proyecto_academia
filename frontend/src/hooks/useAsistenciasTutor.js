import { useMutation, useQueryClient } from '@tanstack/react-query';
import { confirmarAsistenciaTutor } from '@/services/asistenciasService';
import { toast } from 'sonner';

// Hook para que el TUTOR confirme asistencias ya registradas por los padres
export const useAsistenciasTutor = () => {
  const queryClient = useQueryClient();

  const confirmarMutation = useMutation({
    mutationFn: confirmarAsistenciaTutor,
    onSuccess: () => {
      toast.success('Asistencia confirmada correctamente');
      // Invalidar las queries de asistencias para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['tutor', 'mis-asistencias'] });
      queryClient.invalidateQueries({ queryKey: ['padre', 'mis-asistencias'] }); // También actualizar la vista del padre
      queryClient.invalidateQueries({ queryKey: ['asistencias'] }); // Y la lista general
    },
    onError: (error) => {
      toast.error(error?.message || 'Error al confirmar asistencia');
    },
  });

  return {
    confirmarAsistencia: confirmarMutation.mutateAsync,
    ...confirmarMutation,
  };
};

