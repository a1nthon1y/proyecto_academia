import { Router } from "express";
import { getBancos } from "../controllers/bancos.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", auth, getBancos);

export default router;
