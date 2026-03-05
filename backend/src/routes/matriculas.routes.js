import { Router } from "express";
import {
  crearMatricula,
  listarMatriculas,
  obtenerMatricula,
  actualizarMatricula,
  cambiarEstadoMatricula
} from "../controllers/matriculas.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { logAction } from "../middlewares/logger.middleware.js";

const router = Router();
router.use(auth);

// ADMIN (1) y TRABAJADOR (2)
router.post("/",
  allowRoles(1, 2),
  logAction((req) => `Creó matrícula - Alumno ID: ${req.body.alumno_id}, Tutor ID: ${req.body.tutor_id}, Curso ID: ${req.body.curso_id}`),
  crearMatricula
);

router.get("/", allowRoles(1, 2), listarMatriculas);
router.get("/:id", allowRoles(1, 2), obtenerMatricula);

router.put("/:id",
  allowRoles(1, 2),
  logAction((req) => `Actualizó matrícula ID: ${req.params.id}`),
  actualizarMatricula
);

// ADMIN (1) y TRABAJADOR (2) - Cambiar estado
router.put("/:id/estado",
  allowRoles(1, 2),
  logAction((req) => `Cambió estado de matrícula ID: ${req.params.id} a ${req.body.estado}`),
  cambiarEstadoMatricula
);

// ADMIN (1) - Eliminar (solo casos particulares)
router.delete("/:id",
  allowRoles(1),
  logAction((req) => `ELIMINÓ matrícula ID: ${req.params.id} (caso particular)`),
  async (req, res) => {
    try {
      const { pool } = await import("../config/db.js");
      const { rows } = await pool.query(
        "DELETE FROM matriculas WHERE id = $1 RETURNING *",
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Matrícula no encontrada" });
      }

      res.json({ message: "Matrícula eliminada correctamente", data: rows[0] });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// TUTOR (4) - Ver sus matrículas activas
import { listarMisMatriculas } from "../controllers/matriculas.controller.js";

router.get("/mis-matriculas",
  allowRoles(4),
  listarMisMatriculas
);

export default router;
