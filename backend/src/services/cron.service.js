import cron from 'node-cron';
import { pool } from '../config/db.js';
import { registrarLog } from './logs.service.js';

/**
 * Iniciar tareas programadas (Cron Jobs)
 */
export const iniciarCronJobs = () => {
    console.log('⏰ Iniciando Cron Jobs del sistema...');

    // Ejecutar todos los días a las 00:01 AM
    cron.schedule('1 0 * * *', async () => {
        console.log('🔄 Ejecutando tarea programada: Finalización de matrículas vencidas...');

        try {
            // Buscar matrículas activas con fecha_fin vencida (menor a hoy)
            // Usamos CURRENT_DATE para comparar solo la fecha sin hora
            const query = `
        UPDATE matriculas
        SET estado = 'FINALIZADO'
        WHERE estado = 'ACTIVO' 
          AND fecha_fin < CURRENT_DATE
        RETURNING id, alumno_id
      `;

            const { rows } = await pool.query(query);

            if (rows.length > 0) {
                console.log(`✅ Se finalizaron ${rows.length} matrículas vencidas.`);

                // Registrar en logs del sistema
                // Usamos un usuario del sistema (ID 1 o NULL si lo permitiera, pero usaremos 1 como ADMIN sistema)
                // O mejor, creamos una función en logs que acepte null y diga "SYSTEM"

                // Loop simple para logs (podría optimizarse, pero son pocas diarias)
                for (const m of rows) {
                    await registrarLog(3, `SISTEMA: Finalizó automáticamente matrícula ID ${m.id} por vencimiento de plazo`);
                }
            } else {
                console.log('ℹ️ No se encontraron matrículas para finalizar hoy.');
            }

        } catch (error) {
            console.error('❌ Error en Cron Job de finalización de matrículas:', error);
        }
    });

    console.log('✅ Cron Job de finalización de matrículas programado (00:01 AM)');
};
