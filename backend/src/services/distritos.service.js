
import { pool } from "../config/db.js";

export const listarDistritosPorCiudad = async (ciudadId) => {
    const { rows } = await pool.query(
        "SELECT * FROM distritos WHERE ciudad_id = $1 ORDER BY nombre ASC",
        [ciudadId]
    );
    return rows;
};
