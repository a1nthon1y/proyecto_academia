import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registrarTutorCompleto, actualizarTutorCompleto, eliminarTutor } from '@/services/tutoresServiceTrabajador';
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

// Hook para eliminar tutor
export const useEliminarTutor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => eliminarTutor(id), // Importar eliminarTutor de servicios (debo agregarlo en import)
        onSuccess: () => {
            toast.success('Tutor eliminado correctamente');
            queryClient.invalidateQueries({ queryKey: ['tutores', 'trabajador'] });
        },
        onError: (error) => {
            toast.error(error?.message || 'Error al eliminar tutor');
        }
    });
};
