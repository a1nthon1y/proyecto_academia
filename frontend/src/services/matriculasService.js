import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

// Listar todas las matrículas (ADMIN/TRABAJADOR)
// GET /api/matriculas
export async function listarMatriculas() {
  return await makeGetRequest('/api/matriculas');
}

// Obtener una matrícula específica
// GET /api/matriculas/:id
export async function obtenerMatricula(id) {
  return await makeGetRequest(`/api/matriculas/${id}`);
}

// Crear matrícula (ADMIN/TRABAJADOR)
// POST /api/matriculas
export async function crearMatricula(data) {
  return await makePostRequest('/api/matriculas', data);
}

// Actualizar matrícula (ADMIN/TRABAJADOR)
// PUT /api/matriculas/:id
export async function actualizarMatricula(id, data) {
  return await makePutRequest(`/api/matriculas/${id}`, data);
}

// Cambiar estado de matrícula (ADMIN)
// PUT /api/matriculas/:id/estado
export async function cambiarEstadoMatricula(id, estado) {
  return await makePutRequest(`/api/matriculas/${id}/estado`, { estado });
}

// Eliminar matrícula físicamente (SOLO ADMIN - casos particulares)
// DELETE /api/matriculas/:id
export async function eliminarMatricula(id) {
  return await makeDeleteRequest(`/api/matriculas/${id}`);
}
