
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'academ_db',
    password: '123456',
    port: 5432,
});

async function checkSchema() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'tutores'
            ORDER BY ordinal_position;
        `);
        console.log("SCHEMA FOR 'tutores':");
        console.table(res.rows);
        process.exit(0);
    } catch (err) {
        console.error("ERROR:", err);
        process.exit(1);
    }
}

checkSchema();
