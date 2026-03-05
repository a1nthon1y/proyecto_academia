/**
 * Utilidades para manejo de roles basados en rol_id numérico
 * 
 * Roles del sistema:
 * - ADMIN: 1
 * - TRABAJADOR: 2
 * - PADRE: 3
 * - TUTOR: 4
 */

export const ROLES = {
  ADMIN: 1,
  TRABAJADOR: 2,
  PADRE: 3,
  TUTOR: 4,
};

/**
 * Obtiene la ruta de redirección según el rol_id
 * @param {number} rolId - ID numérico del rol
 * @returns {string} Ruta de redirección
 */
export function getRouteByRolId(rolId) {
  switch (rolId) {
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.TRABAJADOR:
      return '/trabajador';
    case ROLES.PADRE:
      return '/padre';
    case ROLES.TUTOR:
      return '/tutor';
    default:
      return '/login';
  }
}

/**
 * Obtiene el nombre del rol según el rol_id
 * @param {number} rolId - ID numérico del rol
 * @returns {string} Nombre del rol
 */
export function getRolName(rolId) {
  switch (rolId) {
    case ROLES.ADMIN:
      return 'ADMIN';
    case ROLES.TRABAJADOR:
      return 'TRABAJADOR';
    case ROLES.PADRE:
      return 'PADRE';
    case ROLES.TUTOR:
      return 'TUTOR';
    default:
      return 'DESCONOCIDO';
  }
}

/**
 * Verifica si un rol_id tiene acceso a una ruta
 * @param {number} rolId - ID numérico del rol
 * @param {string} route - Ruta a verificar
 * @returns {boolean} true si tiene acceso
 */
export function hasAccessToRoute(rolId, route) {
  const routeRoles = {
    '/admin': [ROLES.ADMIN],
    '/trabajador': [ROLES.TRABAJADOR, ROLES.ADMIN],
    '/tutor': [ROLES.TUTOR, ROLES.ADMIN],
    '/padre': [ROLES.PADRE, ROLES.ADMIN],
    '/padre/asistencias': [ROLES.PADRE, ROLES.ADMIN],
    '/padre/historial': [ROLES.PADRE, ROLES.ADMIN],
    '/tutor/asistencias': [ROLES.TUTOR, ROLES.ADMIN],
    '/tutor/alumnos': [ROLES.TUTOR, ROLES.ADMIN],
    '/trabajador/asistencias': [ROLES.TRABAJADOR, ROLES.ADMIN],
    '/trabajador/matriculas': [ROLES.TRABAJADOR, ROLES.ADMIN],
    '/trabajador/pagos': [ROLES.TRABAJADOR, ROLES.ADMIN],
    '/trabajador/consultas': [ROLES.TRABAJADOR, ROLES.ADMIN],
    '/trabajador/alumnos': [ROLES.TRABAJADOR, ROLES.ADMIN],
    '/trabajador/padres': [ROLES.TRABAJADOR, ROLES.ADMIN],
    '/trabajador/tutores': [ROLES.TRABAJADOR, ROLES.ADMIN],
    '/usuarios': [ROLES.ADMIN],
  };

  // Verificar coincidencia exacta primero
  if (routeRoles[route]) {
    return routeRoles[route].includes(rolId);
  }

  // Verificar si la ruta empieza con alguna de las rutas definidas
  // Ordenamos por longitud descendente para asegurar coincidencia con la ruta más específica
  const matchingRoute = Object.keys(routeRoles)
    .sort((a, b) => b.length - a.length)
    .find(definedRoute => route.startsWith(definedRoute));

  if (matchingRoute) {
    return routeRoles[matchingRoute].includes(rolId);
  }

  // Si no hay coincidencia, denegar acceso por defecto (seguridad restrictiva)
  return false;
}
