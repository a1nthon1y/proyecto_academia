import { pool } from "./src/config/db.js";

const addActivoToAlumnos = async () => {
    console.log('🛠️ Alterando tabla alumnos para agregar columna activo...');

    try {
        await pool.query(`
      ALTER TABLE alumnos 
      ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
    `);
        console.log('✅ Éxito: columna activo agregada a alumnos.');

    } catch (error) {
        console.error('❌ Error migrando DB:', error);
    } finally {
        await pool.end();
    }
};

addActivoToAlumnos();
