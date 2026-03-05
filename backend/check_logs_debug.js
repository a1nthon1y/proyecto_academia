import { pool } from "./src/config/db.js";

const checkLogs = async () => {
    console.log('🔍 Verificando tabla logs_sistema...');

    try {
        // 1. Ver estructura
        const estructura = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'logs_sistema'
    `);
        console.log('📋 Estructura de tabla:', estructura.rows);

        // 2. Ver últimos logs
        const logs = await pool.query(`
      SELECT * FROM logs_sistema ORDER BY fecha DESC LIMIT 5
    `);

        if (logs.rowCount === 0) {
            console.log('⚠️ La tabla logs_sistema está vacía.');

            // Intentar insertar uno de prueba
            console.log('🧪 Intentando insertar log de prueba...');
            const insertar = await pool.query(`
        INSERT INTO logs_sistema (usuario_id, accion) 
        VALUES (3, 'TEST: Verificación manual de logs') 
        RETURNING *
      `);
            console.log('✅ Log insertado:', insertar.rows[0]);
        } else {
            console.log('✅ Últimos 5 logs encontrados:', logs.rows);
        }

    } catch (error) {
        console.error('❌ Error verificando logs:', error);
    } finally {
        await pool.end();
    }
};

checkLogs();
