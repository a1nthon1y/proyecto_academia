
import { pool } from "../config/db.js";

export const listarTodosDistritos = async () => {
    const { rows } = await pool.query(
        "SELECT * FROM distritos ORDER BY ciudad_id, nombre ASC"
    );
    return rows;
};

export const listarDistritosPorCiudad = async (ciudadId) => {
    const { rows } = await pool.query(
        "SELECT * FROM distritos WHERE ciudad_id = $1 ORDER BY nombre ASC",
        [ciudadId]
    );
    return rows;
};
