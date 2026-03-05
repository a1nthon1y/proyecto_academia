import { Router } from "express";
import {
    crearCurso,
    listarCursos,
    obtenerCurso,
    actualizarCurso,
    eliminarCurso
} from "../controllers/cursos.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = Router();
router.use(auth);

// Listar cursos - todos los roles autenticados pueden ver
router.get("/", listarCursos);

// Obtener un curso específico - todos los roles
router.get("/:id", obtenerCurso);

// ADMIN (1) y TRABAJADOR (2): crear, actualizar cursos
router.post("/", allowRoles(1, 2), crearCurso);
router.put("/:id", allowRoles(1, 2), actualizarCurso);

// Solo ADMIN (1) puede eliminar cursos
router.delete("/:id", allowRoles(1), eliminarCurso);

export default router;
