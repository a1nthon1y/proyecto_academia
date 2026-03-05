import { makeGetRequest, makePostRequest } from '@/utils/api';

/**
 * TUTOR registra asistencia del día con su ubicación GPS actual
 * POST /api/asistencias/tutor
 */
export async function registrarAsistenciaTutor({
  matriculaId,
  fecha,
  horaLlegada,
  lat,  // 📍 Coordenadas GPS actuales del TUTOR
  lng   // 📍 Para verificación del trabajador
}) {
  // Validación: las coordenadas son requeridas para verificación
  if (!lat || !lng) {
    console.warn('⚠️ Se recomienda enviar la ubicación del tutor para verificación');
  }

  const payload = {
    matricula_id: matriculaId,
    fecha: fecha || null,
    hora_llegada_tutor: horaLlegada || null,
    ubicacion_lat: lat,  // Ubicación actual del tutor
    ubicacion_lng: lng,
  };

  return await makePostRequest('/api/asistencias/tutor', payload);
}

/**
 * ADMIN: registro manual (incluye ubicación si está disponible)
 */
export async function registrarAsistenciaAdmin(data) {
  return await makePostRequest('/api/asistencias/admin', data);
}

/**
 * Listar todas las asistencias (ADMIN/TRABAJADOR)
 * TRABAJADOR puede ver ubicaciones para verificación
 */
export async function listarAsistencias() {
  return await makeGetRequest('/api/asistencias');
}

/**
 * TUTOR: Ver mis propias asistencias
 */
export async function listarMisAsistenciasTutor() {
  return await makeGetRequest('/api/asistencias/tutor/mis-asistencias');
}/**
 * PADRE: Ver asistencias de mis hijos (solo lectura)
 */
export async function listarAsistenciasPadre() {
  return await makeGetRequest('/api/asistencias/padre');
}
