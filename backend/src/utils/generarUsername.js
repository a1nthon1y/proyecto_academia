import { pool } from "../config/db.js";

const limpiar = (texto) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");

export const generarUsername = async ({
  nombres,
  apellidos,
  rol_id
}) => {
  if (!nombres || !apellidos) {
    throw new Error("Nombres y apellidos son obligatorios");
  }

  let prefijo;
  if (rol_id === 1) prefijo = "a";      // ADMIN
  else if (rol_id === 2) prefijo = "w"; // TRABAJADOR (worker)
  else if (rol_id === 3) prefijo = "p"; // PADRE
  else if (rol_id === 4) prefijo = "t"; // TUTOR
  else throw new Error("Rol no soportado para username");

  const inicial = limpiar(nombres)[0];
  const primerApellido = limpiar(apellidos.split(" ")[0]);

  let base = `${prefijo}${inicial}${primerApellido}`;
  let username = base;
  let contador = 1;

  while (true) {
    const existe = await pool.query(
      "SELECT 1 FROM usuarios WHERE username = $1",
      [username]
    );

    if (existe.rowCount === 0) break;

    contador++;
    username = `${base}${contador}`;
  }

  return username;
};
