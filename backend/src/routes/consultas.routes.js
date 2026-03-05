import { Router } from "express";
import {
  crearConsulta,
  listarConsultas,
  obtenerConsulta,
  cambiarEstadoConsulta,
  asignarConsulta
} from "../controllers/consultas.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = Router();

// Público (sin auth)
router.post("/", crearConsulta);

// Internos
router.use(auth);

// ADMIN (1) y TRABAJADOR (2)
router.get("/", allowRoles(1, 2), listarConsultas);
router.get("/:id", allowRoles(1, 2), obtenerConsulta);
router.put(
  "/:id/estado",
  allowRoles(1, 2),
  cambiarEstadoConsulta
);

// ADMIN (1)
router.put(
  "/:id/asignar",
  allowRoles(1),
  asignarConsulta
);

export default router;
