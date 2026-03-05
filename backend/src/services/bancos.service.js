import { pool } from "../config/db.js";

export const listarBancos = async () => {
    const { rows } = await pool.query("SELECT * FROM bancos ORDER BY nombre ASC");
    return rows;
};
