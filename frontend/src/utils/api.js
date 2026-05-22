import axios from "axios";
import environment from "@/config/environment";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const BASE_URL = environment.url_backend;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();

    // Si no hay token, simplemente continuar sin Authorization
    if (!token) {
      return config;
    }

    // Validar formato y expiración ANTES de enviar la request
    const isValidFormat = authService.isValidTokenFormat(token);
    const isExpired = authService.isTokenExpired(token);

    if (!isValidFormat || isExpired) {
      // Limpiar sesión si el token es inválido o ha expirado
      authService.logout();

      // Evitar loops en la landing donde ya está el modal de login
      const inLoginContext = typeof window !== 'undefined' &&
        (window.location.pathname === '/' || window.location.pathname === '/login');
      if (!inLoginContext) {
        toast.error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', {
          duration: 5000,
        });

        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/?login=1';
          }
        }, 2000);
      }

      // Cancelar la petición antes de ser enviada
      return Promise.reject(new Error('Sesión expirada. Por favor, inicie sesión nuevamente.'));
    }

    // Token válido -> adjuntarlo al header
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Si el token ha expirado o es inválido
      console.log('Token expirado o inválido, redirigiendo al login...');

      // Limpiar datos de autenticación
      authService.logout();

      const inLoginContext = typeof window !== 'undefined' &&
        (window.location.pathname === '/' || window.location.pathname === '/login');
      if (!inLoginContext) {
        toast.error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.', {
          duration: 5000,
        });

        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/?login=1';
          }
        }, 2000);
      }

      return Promise.reject(new Error('Sesión expirada. Por favor, inicie sesión nuevamente.'));
    }

    // Para otros errores, mostrar el mensaje específico
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error en la petición';
    return Promise.reject(new Error(errorMessage));
  }
);

export const makeGetRequest = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("Error making GET request:", error);
    throw error;
  }
};

export const makePostRequest = async (url, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Error haciendo la solicitud POST:", error);
    throw error;
  }
};

export const makePutRequest = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    console.error("Error haciendo la solicitud PUT:", error);
    throw error;
  }
};

export const makeDeleteRequest = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error making DELETE request:", error);
    throw error;
  }
};

export default api;


