import { useAuth } from './useAuth';

/**
 * Hook para gestionar permisos basados en roles
 * Roles: 1=ADMIN, 2=TRABAJADOR, 3=PADRE, 4=TUTOR
 */
export const usePermissions = () => {
    const { user } = useAuth();

    const isAdmin = user?.rol_id === 1;
    const isTrabajador = user?.rol_id === 2;
    const isPadre = user?.rol_id === 3;
    const isTutor = user?.rol_id === 4;

    // Permisos de creación
    const canCreate = isAdmin || isTrabajador;

    // Permisos de edición
    const canEdit = isAdmin || isTrabajador;

    // Permisos de eliminación física (solo ADMIN en casos particulares)
    const canDelete = isAdmin;

    // Permisos para cambiar estados (ADMIN y TRABAJADOR)
    const canChangeStatus = isAdmin || isTrabajador;

    // Ver toda la información
    const canViewAll = isAdmin || isTrabajador;

    // Ver solo información propia
    const canViewOwn = isPadre || isTutor;

    // Registrar asistencias (ADMIN, TRABAJADOR, TUTOR)
    const canRegisterAttendance = isAdmin || isTrabajador || isTutor;

    // Ver logs del sistema (solo ADMIN)
    const canViewLogs = isAdmin;

    return {
        // Roles
        isAdmin,
        isTrabajador,
        isPadre,
        isTutor,

        // Permisos generales
        canCreate,
        canEdit,
        canDelete,
        canChangeStatus,
        canViewAll,
        canViewOwn,
        canRegisterAttendance,
        canViewLogs,
    };
};
