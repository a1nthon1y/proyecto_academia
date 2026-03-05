import environment from '@/config/environment';

class AuthService {
  getToken() {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  }

  getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated() {
    try {
      const token = this.getToken();
      const user = this.getUser();
      
      if (!token || !user) {
        return false;
      }

      // Verificar que el usuario esté activo (si el backend expone esta propiedad)
      // Si no existe "activo", no bloqueamos la sesión solo por eso.
      if (typeof user.activo !== 'undefined' && user.activo !== true) {
        return false;
      }

      // Verificar si el token tiene formato JWT válido
      if (token && !this.isValidTokenFormat(token)) {
        return false;
      }

      // Verificar si el token ha expirado
      if (token && this.isTokenExpired(token)) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  isValidTokenFormat(token) {
    // Verificar formato básico de JWT (3 partes separadas por puntos)
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Verificar que las partes sean válidas (base64)
    try {
      parts.forEach(part => {
        if (part) {
          atob(part.replace(/-/g, '+').replace(/_/g, '/'));
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  // Verificar si el token ha expirado (uso centralizado)
  isTokenExpired(token) {
    try {
      // Decodificar el payload del JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      // Verificar si el token ha expirado
      return payload.exp < currentTime;
    } catch {
      // Si no se puede decodificar, considerar como expirado
      return true;
    }
  }

  async login(credentials) {
    const response = await fetch(`${environment.url_backend}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // El backend espera "login" (email o username) y "password"
        login: credentials.login,
        password: credentials.password
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Error al iniciar sesión');
    }

    // Estandarizar la forma del usuario que viene del backend
    // Backend responde: { token, usuario: { id, email, rol_id } }
    const user = data.user || data.usuario || null;

    if (!data.token || !user) {
      throw new Error('Respuesta de autenticación inválida');
    }

    // Guardar datos en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(user));

    return {
      message: data.message || 'Inicio de sesión exitoso',
      token: data.token,
      user
    };
  }

  logout() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Método para verificar si el token está próximo a expirar
  isTokenExpiringSoon() {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    try {
      // Decodificar el payload del JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;
      
      // Considerar que está próximo a expirar si faltan menos de 5 minutos
      return timeUntilExpiry < 300;
    } catch {
      return true;
    }
  }

  // Método para obtener información del token
  getTokenInfo() {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        exp: payload.exp,
        iat: payload.iat,
        userId: payload.userId,
        email: payload.email,
        // Compatibilidad con distintos nombres de campo de rol en el payload
        role: payload.role || payload.rol || payload.rol_id
      };
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService(); 