
import * as ciudadesService from "../services/ciudades.service.js";

export const listarCiudades = async (req, res) => {
    try {
        const ciudades = await ciudadesService.listarCiudades();
        res.json(ciudades);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
