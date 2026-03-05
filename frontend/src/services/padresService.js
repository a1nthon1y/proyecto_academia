import { makeGetRequest } from '@/utils/api';

// Obtener los hijos del padre autenticado
// GET /api/padres/mis-hijos
export async function getMisHijos() {
  return await makeGetRequest('/api/padres/mis-hijos');
}

// Obtener las asistencias del padre autenticado
// GET /api/padres/asistencias
export async function getMisAsistencias() {
  return await makeGetRequest('/api/padres/asistencias');
}

// Obtener perfil del padre autenticado
// GET /api/padres/perfil
export async function getPerfilPadre() {
  return await makeGetRequest('/api/padres/perfil');
}

// Obtener tutores asignados a los hijos del padre (con matrículas activas)
// GET /api/padres/mis-tutores
export async function getMisTutores() {
  return await makeGetRequest('/api/padres/mis-tutores');
}
