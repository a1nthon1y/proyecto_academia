import * as contratoService from "../services/contratos.service.js";

export const crearContrato = async (req, res) => {
    try {
        const contrato = await contratoService.crearContrato(req.body);
        res.status(201).json(contrato);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const listarContratos = async (req, res) => {
    try {
        const contratos = await contratoService.listarContratos();
        res.json(contratos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerContrato = async (req, res) => {
    try {
        const contrato = await contratoService.obtenerContrato(req.params.id);
        res.json(contrato);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const actualizarContrato = async (req, res) => {
    try {
        const contrato = await contratoService.actualizarContrato(
            req.params.id,
            req.body
        );
        res.json(contrato);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
