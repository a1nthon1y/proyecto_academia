import * as pagosService from "../services/pagos.service.js";

// PADRES
export const registrarPagoPadre = async (req, res) => {
  try {
    const pago = await pagosService.registrarPagoPadre(req.body);
    res.status(201).json(pago);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listarPagosPadres = async (req, res) => {
  const pagos = await pagosService.listarPagosPadres();
  res.json(pagos);
};

export const listarMisPagos = async (req, res) => {
  const pagos = await pagosService.listarPagosPadre(req.user.userId);
  res.json(pagos);
};

// TUTORES
export const generarPagoTutor = async (req, res) => {
  try {
    const pago = await pagosService.generarPagoTutor(req.body);
    res.status(201).json(pago);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const pagarTutor = async (req, res) => {
  try {
    const pago = await pagosService.pagarTutor(req.body.pago_tutor_id);
    res.json(pago);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listarPagosTutores = async (req, res) => {
  const pagos = await pagosService.listarPagosTutores();
  res.json(pagos);
};
