
import { Router } from "express";
import { listarDistritosPorCiudad, listarTodosDistritos } from "../controllers/distritos.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", auth, listarTodosDistritos);
router.get("/ciudad/:ciudadId", auth, listarDistritosPorCiudad);

export default router;
