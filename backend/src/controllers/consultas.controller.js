import * as consultasService from "../services/consultas.service.js";

export const crearConsulta = async (req, res) => {
  try {
    const consulta = await consultasService.crearConsulta(req.body);
    res.status(201).json({
      message: "Consulta enviada correctamente",
      data: consulta
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listarConsultas = async (req, res) => {
  const data = await consultasService.listarConsultas();
  res.json(data);
};

export const obtenerConsulta = async (req, res) => {
  try {
    const data = await consultasService.obtenerConsulta(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const cambiarEstadoConsulta = async (req, res) => {
  try {
    const data = await consultasService.cambiarEstado(
      req.params.id,
      req.body.estado,
      req.user.userId
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const asignarConsulta = async (req, res) => {
  try {
    const data = await consultasService.asignarConsulta(
      req.params.id,
      req.body.usuario_id
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
