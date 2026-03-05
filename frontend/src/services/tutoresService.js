import { makeGetRequest, makePostRequest } from '@/utils/api';

// Obtener asistencias del tutor autenticado
// GET /api/asistencias/tutor/mis-asistencias
export async function getMisAsistenciasTutor() {
  return await makeGetRequest('/api/asistencias/tutor/mis-asistencias');
}

// Registrar asistencia con ubicación (GPS)
// POST /api/asistencias/tutor
export async function registrarAsistenciaTutor(data) {
  /* data debe incluir: { matricula_id, fecha, hora_llegada_tutor, ubicacion_lat, ubicacion_lng } */
  return await makePostRequest('/api/asistencias/tutor', data);
}

// Obtener perfil del tutor autenticado
// GET /api/tutores/perfil
export async function getPerfilTutor() {
  return await makeGetRequest('/api/tutores/perfil');
}

// Obtener matrículas activas del tutor
// GET /api/matriculas/mis-matriculas
export async function getMisMatriculasTutor() {
  return await makeGetRequest('/api/matriculas/mis-matriculas');
}
