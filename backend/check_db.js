import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: process.env.DB_PASSWORD || "123456",
    database: "academ_db",
});

async function checkSchema() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'matriculas'
            ORDER BY ordinal_position;
        `);
        console.log("SCHEMA FOR 'matriculas' TABLE:");
        console.table(res.rows);

        const resBancos = await pool.query(`SELECT COUNT(*) FROM bancos`);
        console.log("BANCOS COUNT:", resBancos.rows[0].count);

        const resAlumnos = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'alumnos'
            ORDER BY ordinal_position;
        `);
        console.log("\nSCHEMA FOR 'alumnos' TABLE:");
        console.table(resAlumnos.rows);

        const resNiveles = await pool.query(`SELECT * FROM niveles ORDER BY id`);
        console.log("\nNIVELES DATA:");
        console.table(resNiveles.rows);

        process.exit(0);
    } catch (err) {
        console.error("ERROR CHECKING SCHEMA:", err);
        process.exit(1);
    }
}

checkSchema();
