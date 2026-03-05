import { Router } from "express";
import {
  crearUsuarioInterno,
  listarUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario
} from "../controllers/usuarios.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.use(auth);
router.use(allowRoles(1)); // 1 = ADMIN

router.post("/", crearUsuarioInterno);
router.get("/", listarUsuarios);
router.get("/:id", obtenerUsuario);
router.put("/:id", actualizarUsuario);
router.patch("/:id/estado", cambiarEstadoUsuario);

export default router;
