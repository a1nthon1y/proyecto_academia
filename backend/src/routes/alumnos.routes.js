import { Router } from "express";

import {
  crearAlumno,
  listarAlumnos,
  obtenerAlumno,
  actualizarAlumno,
  eliminarAlumno
} from "../controllers/alumnos.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { logAction } from "../middlewares/logger.middleware.js";

const router = Router();

// Middleware global de autenticación
router.use(auth);

// ADMIN (1) y TRABAJADOR (2)
router.post("/",
  allowRoles(1, 2),
  logAction((req) => `Creó alumno DNI: ${req.body.dni}`),
  crearAlumno
);

router.get("/", allowRoles(1, 2), listarAlumnos);
router.get("/:id", allowRoles(1, 2), obtenerAlumno);

router.put("/:id",
  allowRoles(1, 2),
  logAction((req) => `Actualizó alumno ID: ${req.params.id}`),
  actualizarAlumno
);

// ADMIN (1)
router.delete("/:id",
  allowRoles(1),
  logAction((req) => `ELIMINÓ alumno ID: ${req.params.id}`),
  eliminarAlumno
);

// router.delete("/:id", allowRoles(1), desactivarAlumno);

export default router;
