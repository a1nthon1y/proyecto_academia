/**
 * Servicio de Geolocalización para captura automática de ubicación del tutor
 * Solicita permisos y obtiene coordenadas GPS
 */

export class GeolocationService {
    /**
     * Verifica si el navegador soporta geolocalización
     */
    static isSupported() {
        return 'geolocation' in navigator;
    }

    /**
     * Solicita permisos y obtiene la ubicación actual
     * @returns {Promise<{lat: number, lng: number}>}
     */
    static async getCurrentPosition() {
        if (!this.isSupported()) {
            throw new Error('Tu navegador no soporta geolocalización');
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy, // en metros
                        timestamp: position.timestamp,
                    });
                },
                (error) => {
                    let errorMessage = 'Error al obtener ubicación';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Debes activar los permisos de ubicación para registrar asistencia';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Ubicación no disponible. Verifica tu GPS';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Tiempo de espera agotado al obtener ubicación';
                            break;
                        default:
                            errorMessage = 'Error desconocido al obtener ubicación';
                    }

                    reject(new Error(errorMessage));
                },
                {
                    enableHighAccuracy: true, // Usar GPS si está disponible
                    timeout: 10000, // 10 segundos máximo
                    maximumAge: 0, // No usar caché, siempre ubicación actual
                }
            );
        });
    }

    /**
     * Verifica el estado de los permisos de geolocalización
     * @returns {Promise<PermissionState>} 'granted', 'denied', o 'prompt'
     */
    static async checkPermissionStatus() {
        if (!('permissions' in navigator)) {
            // Si no hay API de permisos, intentar obtener ubicación directamente
            return 'prompt';
        }

        try {
            const result = await navigator.permissions.query({ name: 'geolocation' });
            return result.state; // 'granted', 'denied', o 'prompt'
        } catch (error) {
            // Algunos navegadores no soportan query de geolocation
            return 'prompt';
        }
    }

    /**
     * Solicita permisos de ubicación con mensaje personalizado
     */
    static async requestPermission() {
        try {
            const position = await this.getCurrentPosition();
            return { success: true, position };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Valida que las coordenadas sean válidas
     */
    static validateCoordinates(lat, lng) {
        const isValidLat = lat >= -90 && lat <= 90;
        const isValidLng = lng >= -180 && lng <= 180;
        return isValidLat && isValidLng;
    }
}

export default GeolocationService;
