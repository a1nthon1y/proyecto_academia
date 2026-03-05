import { registrarLog } from '../services/logs.service.js';

/**
 * Middleware para registrar acciones en logs_sistema
 * Solo registra acciones de ADMIN (1) y TRABAJADOR (2)
 */
export const logAction = (accionTemplate) => {
    return async (req, res, next) => {
        // Solo loguear para ADMIN y TRABAJADOR
        if (req.usuario && [1, 2].includes(req.usuario.rol_id)) {
            const accion = typeof accionTemplate === 'function'
                ? accionTemplate(req)
                : accionTemplate;

            try {
                await registrarLog(req.usuario.id, accion);
            } catch (error) {
                console.error('Error al registrar log:', error);
                // No interrumpir la operación principal si falla el log
            }
        }
        next();
    };
};

/**
 * Middleware para registrar logs DESPUÉS de una operación exitosa
 * Útil cuando necesitamos datos del response
 */
export const logActionAfter = (accionTemplate) => {
    return (req, res, next) => {
        // Guardar el método send original
        const originalSend = res.send;

        // Sobrescribir send
        res.send = function (data) {
            // Solo loguear si la operación fue exitosa (status 200-299)
            if (req.usuario && [1, 2].includes(req.usuario.rol_id) && res.statusCode >= 200 && res.statusCode < 300) {
                const accion = typeof accionTemplate === 'function'
                    ? accionTemplate(req, data)
                    : accionTemplate;

                registrarLog(req.usuario.id, accion).catch(err => {
                    console.error('Error al registrar log:', err);
                });
            }

            // Llamar al send original
            originalSend.call(this, data);
        };

        next();
    };
};
