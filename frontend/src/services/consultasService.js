import { makeGetRequest, makePostRequest, makePutRequest } from '@/utils/api';

export async function listarConsultas() {
  return await makeGetRequest('/api/consultas');
}

export async function obtenerConsulta(id) {
  return await makeGetRequest(`/api/consultas/${id}`);
}

export async function crearConsulta(data) {
  return await makePostRequest('/api/consultas', data);
}

export async function cambiarEstadoConsulta(id, estado) {
  return await makePutRequest(`/api/consultas/${id}/estado`, { estado });
}

export async function asignarConsulta(id, usuarioId) {
  return await makePutRequest(`/api/consultas/${id}/asignar`, { usuario_asignado: usuarioId });
}
