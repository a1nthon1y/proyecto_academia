import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

/**
 * Listar todos los cursos
 * Todos los roles autenticados pueden ver cursos
 */
export async function listarCursos() {
  return await makeGetRequest('/api/cursos');
}

/**
 * Obtener un curso específico
 */
export async function obtenerCurso(id) {
  return await makeGetRequest(`/api/cursos/${id}`);
}

/**
 * Crear curso (ADMIN/TRABAJADOR)
 */
export async function crearCurso(data) {
  return await makePostRequest('/api/cursos', data);
}

/**
 * Actualizar curso (ADMIN/TRABAJADOR)
 */
export async function actualizarCurso(id, data) {
  return await makePutRequest(`/api/cursos/${id}`, data);
}

/**
 * Eliminar curso (SOLO ADMIN)
 */
export async function eliminarCurso(id) {
  return await makeDeleteRequest(`/api/cursos/${id}`);
}
