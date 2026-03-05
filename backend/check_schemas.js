import { pool } from "./src/config/db.js";

const checkSchemas = async () => {
    const tables = ['alumnos', 'padres', 'tutores', 'usuarios'];

    for (const table of tables) {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = '${table}'
    `);
        console.log(`📋 Tabla ${table}:`, res.rows.map(c => c.column_name).join(', '));
    }
    await pool.end();
};

checkSchemas();
