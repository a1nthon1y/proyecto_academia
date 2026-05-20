
import * as distritosService from "../services/distritos.service.js";

export const listarTodosDistritos = async (req, res) => {
    try {
        const distritos = await distritosService.listarTodosDistritos();
        res.json(distritos);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

export const listarDistritosPorCiudad = async (req, res) => {
    try {
        const { ciudadId } = req.params;
        const distritos = await distritosService.listarDistritosPorCiudad(ciudadId);
        res.json(distritos);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
