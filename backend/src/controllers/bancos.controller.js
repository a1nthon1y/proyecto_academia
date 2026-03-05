import { listarBancos } from "../services/bancos.service.js";

export const getBancos = async (req, res) => {
    try {
        const bancos = await listarBancos();
        res.json(bancos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
