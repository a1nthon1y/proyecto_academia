import { pool } from "./src/config/db.js";

const migrateLogs = async () => {
    console.log('🛠️ Alterando tabla logs_sistema para permitir usuario_id NULL...');

    try {
        await pool.query(`
      ALTER TABLE logs_sistema 
      ALTER COLUMN usuario_id DROP NOT NULL;
    `);
        console.log('✅ Éxito: usuario_id ahora permite NULL (para logs del sistema).');

        // Verificación
        const res = await pool.query(`
      SELECT is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'logs_sistema' AND column_name = 'usuario_id'
    `);
        console.log('🔍 Estado actual (YES = nullable):', res.rows[0].is_nullable);

    } catch (error) {
        console.error('❌ Error migrando DB:', error);
    } finally {
        await pool.end();
    }
};

migrateLogs();
