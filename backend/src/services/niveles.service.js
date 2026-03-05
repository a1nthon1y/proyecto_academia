import { pool } from "../config/db.js";

export const listarNiveles = async () => {
    const { rows } = await pool.query("SELECT * FROM niveles ORDER BY id ASC");
    return rows;
};
