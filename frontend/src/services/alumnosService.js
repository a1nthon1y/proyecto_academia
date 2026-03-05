import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

// Listar todos los alumnos (ADMIN/TRABAJADOR)
// GET /api/alumnos
export async function listarAlumnos() {
  return await makeGetRequest('/api/alumnos');
}

// Obtener un alumno específico
// GET /api/alumnos/:id
export async function obtenerAlumno(id) {
  return await makeGetRequest(`/api/alumnos/${id}`);
}

// Crear alumno (ADMIN/TRABAJADOR)
// POST /api/alumnos { nombres, apellidos, fecha_nacimiento, padre_id }
export async function crearAlumno(data) {
  return await makePostRequest('/api/alumnos', data);
}

// Actualizar alumno (ADMIN/TRABAJADOR)
// PUT /api/alumnos/:id
export async function actualizarAlumno(id, data) {
  return await makePutRequest(`/api/alumnos/${id}`, data);
}

// Eliminar alumno (ADMIN/TRABAJADOR)
// DELETE /api/alumnos/:id
export async function eliminarAlumno(id) {
  return await makeDeleteRequest(`/api/alumnos/${id}`);
}
