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

// Listar todos los tutores (ADMIN/TRABAJADOR)
// GET /api/tutores
export async function listarTutores() {
  return await makeGetRequest('/api/tutores');
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

// Eliminar tutor (ADMIN/TRABAJADOR)
// DELETE /api/tutores/:id
export async function eliminarTutor(id) {
  return await makeDeleteRequest(`/api/tutores/${id}`);
}

// Obtener disponibilidad horaria semanal + carga de matrículas activas
// GET /api/tutores/:id/disponibilidad
export async function getDisponibilidadTutor(id) {
  return await makeGetRequest(`/api/tutores/${id}/disponibilidad`);
}
