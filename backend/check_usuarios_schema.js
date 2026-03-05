
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
        const resCols = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'usuarios'
            ORDER BY ordinal_position;
        `);
        console.log("SCHEMA FOR 'usuarios':");
        console.table(resCols.rows);

        const resConstraints = await pool.query(`
            SELECT conname, contype, pg_get_constraintdef(c.oid)
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE n.nspname = 'public' AND (conrelid = 'usuarios'::regclass OR conrelid = 'tutores'::regclass);
        `);
        console.log("\nCONSTRAINTS:");
        console.table(resConstraints.rows);

        process.exit(0);
    } catch (err) {
        console.error("ERROR:", err);
        process.exit(1);
    }
}

checkSchema();
