import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

// Crear tutor completo (usuario + perfil)
// POST /api/tutores
export async function registrarTutorCompleto(data) {
  return await makePostRequest('/api/tutores', data);
}

// Actualizar tutor completo
// PUT /api/tutores/:id
export async function actualizarTutorCompleto(id, data) {
  return await makePutRequest(`/api/tutores/${id}`, data);
}

// Listar tutores. Por defecto solo trae los activos; pasa true para incluir inactivos.
export async function listarTutores(incluirInactivos = false) {
  return await makeGetRequest(`/api/tutores${incluirInactivos ? '?incluirInactivos=true' : ''}`);
}

// Obtener un tutor específico
// GET /api/tutores/:id
export async function obtenerTutor(id) {
  return await makeGetRequest(`/api/tutores/${id}`);
}

// Crear tutor (ADMIN/TRABAJADOR)
// POST /api/tutores { usuario_id, nombres, apellidos, telefono, direccion, zona_id, ubicacion_lat, ubicacion_lng }
export async function crearTutor(data) {
  return await makePostRequest('/api/tutores', data);
}

// Actualizar tutor (ADMIN/TRABAJADOR)
// PUT /api/tutores/:id
export async function actualizarTutor(id, data) {
  return await makePutRequest(`/api/tutores/${id}`, data);
}

// Desactivar tutor (soft delete). El backend devuelve matriculas_activas asociadas.
export async function desactivarTutor(id) {
  return await makeDeleteRequest(`/api/tutores/${id}`);
}

export async function reactivarTutor(id) {
  return await makePutRequest(`/api/tutores/${id}/reactivar`, {});
}

// Alias retro-compatible
export const eliminarTutor = desactivarTutor;

// Obtener disponibilidad horaria semanal + carga de matrículas activas
// GET /api/tutores/:id/disponibilidad
export async function getDisponibilidadTutor(id) {
  return await makeGetRequest(`/api/tutores/${id}/disponibilidad`);
}
