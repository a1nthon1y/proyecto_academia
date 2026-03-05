import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

// Crear padre de familia completo (usuario + perfil)
// POST /api/padres
export async function registrarPadreCompleto(data) {
  return await makePostRequest('/api/padres', data);
}

// Actualizar padre de familia
// PUT /api/padres/:id
export async function actualizarPadreCompleto(id, data) {
  return await makePutRequest(`/api/padres/${id}`, data);
}

// Listar todos los padres (ADMIN/TRABAJADOR)
// GET /api/padres
export async function listarPadres() {
  return await makeGetRequest('/api/padres');
}

// Obtener un padre específico
// GET /api/padres/:id
export async function obtenerPadre(id) {
  return await makeGetRequest(`/api/padres/${id}`);
}

// Eliminar padre (ADMIN/TRABAJADOR)
// DELETE /api/padres/:id
export async function eliminarPadre(id) {
  return await makeDeleteRequest(`/api/padres/${id}`);
}
