import * as nivelesService from "../services/niveles.service.js";

export const getNiveles = async (req, res) => {
    try {
        const niveles = await nivelesService.listarNiveles();
        res.json(niveles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
