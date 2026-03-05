
import { makeGetRequest } from '@/utils/api';

// Listar todos los bancos
export async function listarBancos() {
    return await makeGetRequest('/api/bancos');
}
