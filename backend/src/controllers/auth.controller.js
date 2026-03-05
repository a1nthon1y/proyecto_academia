import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

export const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const { rows } = await pool.query(
      `
      SELECT id, email, username, password_hash, rol_id, activo
      FROM usuarios
      WHERE (email = $1 OR username = $1)
      LIMIT 1
      `,
      [login]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const usuario = rows[0];

    // 🔒 USUARIO DESHABILITADO
    if (!usuario.activo) {
      return res.status(403).json({ message: "Usuario deshabilitado" });
    }

    // 🔐 VALIDAR PASSWORD
    const valid = await bcrypt.compare(password, usuario.password_hash);

    if (!valid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 🎟️ TOKEN
    const token = jwt.sign(
      {
        userId: usuario.id,
        rol_id: usuario.rol_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        username: usuario.username,
        rol_id: usuario.rol_id
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el login" });
  }
};
