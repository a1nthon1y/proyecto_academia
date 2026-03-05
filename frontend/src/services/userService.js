import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from '@/utils/api';

export async function getUsers() {
  try {
    const data = await makeGetRequest("/api/usuarios");
    return data;
  } catch (e) {
    throw e;
  }
}

export async function createUser(user) {
  try {
    const data = await makePostRequest("/api/usuarios", user);
    return data;
  } catch (e) {
    throw e;
  }
}

export async function updateUser(id, user) {
  try {
    const data = await makePutRequest(`/api/usuarios/${id}`, user);
    return data;
  } catch (e) {
    throw e;
  }
}

export async function toggleUserStatus(id, status) {
  try {
    const data = await makePostRequest(`/api/usuarios/${id}/estado`, { activo: status }, { method: 'PATCH' });
    // Note: makePostRequest with { method: 'PATCH' } in some custom api implementations might be necessary 
    // or I can check if makePatchRequest exists. 
    return data;
  } catch (e) {
    throw e;
  }
}
export async function deleteUser(id) {
  try {
    const data = await makeDeleteRequest(`/api/usuarios/${id}`);
    return data;
  } catch (e) {
    throw e;
  }
}