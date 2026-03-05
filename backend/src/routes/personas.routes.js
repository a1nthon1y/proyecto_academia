import { Router } from "express";
import {
  registrarPadre,
  registrarTutor,
  actualizarPadre,
  actualizarTutor
} from "../controllers/personas.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = Router();

// 🔐 Autenticación global
router.use(auth);
// PADRES
router.post("/padres", allowRoles(1, 2), registrarPadre);
router.put("/padres/:id", allowRoles(1, 2), actualizarPadre);

// TUTORES
router.post("/tutores", allowRoles(1, 2), registrarTutor);
router.put("/tutores/:id", allowRoles(1, 2), actualizarTutor);
export default router;
