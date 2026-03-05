import { pool } from "./src/config/db.js";

const checkUsers = async () => {
    try {
        const res = await pool.query("SELECT id, email, rol_id, activo FROM usuarios ORDER BY id");
        console.log("👥 Usuarios existentes:", res.rows);
    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
};

checkUsers();
