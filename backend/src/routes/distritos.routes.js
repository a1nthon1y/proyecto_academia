
import { Router } from "express";
import { listarDistritosPorCiudad } from "../controllers/distritos.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/ciudad/:ciudadId", auth, listarDistritosPorCiudad);

export default router;
