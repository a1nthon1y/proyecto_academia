import { Router } from "express";
import {
  registrarAsistenciaTutor,
  registrarAsistenciaAdmin,
  listarAsistencias,
  listarMisAsistencias,
  listarAsistenciasPadre
} from "../controllers/asistencias.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = Router();
router.use(auth);

// TUTOR (4) registra asistencias con ubicación GPS
router.post(
  "/tutor",
  allowRoles(4),
  registrarAsistenciaTutor
);

// TUTOR (4) ve sus propias asistencias
router.get(
  "/tutor/mis-asistencias",
  allowRoles(4),
  listarMisAsistencias
);

// TUTOR (4) confirma una asistencia existente
router.post(
  "/tutor/:id/confirmar",
  allowRoles(4),
  async (req, res) => {
    try {
      const { pool } = await import("../config/db.js");
      const { rows: tutorRows } = await pool.query(
        "SELECT id FROM tutores WHERE usuario_id = $1",
        [req.user.userId]
      );
      if (tutorRows.length === 0) {
        return res.status(403).json({ message: "Tutor no válido" });
      }

      const { rows } = await pool.query(`
        UPDATE asistencias a
        SET confirmado_tutor = true
        FROM matriculas m
        WHERE a.id = $1
          AND a.matricula_id = m.id
          AND m.tutor_id = $2
        RETURNING a.*
      `, [req.params.id, tutorRows[0].id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: "Asistencia no encontrada o no pertenece al tutor" });
      }

      res.json({ message: "Asistencia confirmada", data: rows[0] });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// PADRE (3) solo puede ver asistencias (lectura)
router.get(
  "/padre",
  allowRoles(3),
  listarAsistenciasPadre
);

// ADMIN (1) registro manual/excepción
router.post(
  "/admin",
  allowRoles(1),
  registrarAsistenciaAdmin
);

// ADMIN (1) y TRABAJADOR (2) - reportes completos
router.get(
  "/",
  allowRoles(1, 2),
  listarAsistencias
);

export default router;
