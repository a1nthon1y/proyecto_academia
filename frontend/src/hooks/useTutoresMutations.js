import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  registrarTutorCompleto,
  actualizarTutorCompleto,
  desactivarTutor,
  reactivarTutor,
} from '@/services/tutoresServiceTrabajador';
import { toast } from 'sonner';

// Hook para registrar tutor completo (usuario + perfil)
export const useRegistrarTutorCompleto = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: registrarTutorCompleto,
        onSuccess: (data) => {
            toast.success('Tutor registrado correctamente');
            queryClient.invalidateQueries({ queryKey: ['tutores', 'trabajador'] });
            return data; // Retorna los datos incluyendo credenciales
        },
        onError: (error) => {
            toast.error(error?.message || 'Error al registrar tutor');
        },
    });

    return mutation;
};

// Hook para actualizar tutor completo
export const useActualizarTutorCompleto = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, data }) => actualizarTutorCompleto(id, data),
        onSuccess: () => {
            toast.success('Tutor actualizado correctamente');
            queryClient.invalidateQueries({ queryKey: ['tutores', 'trabajador'] });
        },
        onError: (error) => {
            toast.error(error?.message || 'Error al actualizar tutor');
        },
    });

    return mutation;
};

// Hook para desactivar tutor (soft delete)
export const useDesactivarTutor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => desactivarTutor(id),
        onSuccess: (data) => {
            const activas = data?.matriculas_activas || 0;
            if (activas > 0) {
                toast.success(`Tutor desactivado. ⚠️ Tenía ${activas} matrícula(s) activa(s) — revísalas.`, { duration: 6000 });
            } else {
                toast.success('Tutor desactivado correctamente');
            }
            queryClient.invalidateQueries({ queryKey: ['tutores', 'trabajador'] });
        },
        onError: (error) => {
            toast.error(error?.message || 'Error al desactivar tutor');
        }
    });
};

// Hook para reactivar tutor
export const useReactivarTutor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => reactivarTutor(id),
        onSuccess: () => {
            toast.success('Tutor reactivado correctamente');
            queryClient.invalidateQueries({ queryKey: ['tutores', 'trabajador'] });
        },
        onError: (error) => {
            toast.error(error?.message || 'Error al reactivar tutor');
        }
    });
};

// Alias retro-compatible (cualquier consumidor anterior sigue funcionando)
export const useEliminarTutor = useDesactivarTutor;
