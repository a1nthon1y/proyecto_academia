import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

export async function registrarPadreCompleto(data) {
  return await makePostRequest('/api/padres', data);
}

export async function actualizarPadreCompleto(id, data) {
  return await makePutRequest(`/api/padres/${id}`, data);
}

// Listar padres. Por defecto solo trae los activos; pasa true para incluir inactivos.
export async function listarPadres(incluirInactivos = false) {
  return await makeGetRequest(`/api/padres${incluirInactivos ? '?incluirInactivos=true' : ''}`);
}

export async function obtenerPadre(id) {
  return await makeGetRequest(`/api/padres/${id}`);
}

// Desactivar padre (soft delete). El backend devuelve matriculas_activas asociadas.
export async function desactivarPadre(id) {
  return await makeDeleteRequest(`/api/padres/${id}`);
}

// Reactivar padre desactivado
export async function reactivarPadre(id) {
  return await makePutRequest(`/api/padres/${id}/reactivar`, {});
}

// Alias retro-compatible
export const eliminarPadre = desactivarPadre;
