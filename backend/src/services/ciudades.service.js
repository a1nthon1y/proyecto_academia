
import { pool } from "../config/db.js";

export const listarCiudades = async () => {
    const { rows } = await pool.query("SELECT * FROM ciudades ORDER BY nombre ASC");
    return rows;
};
