import * as matriculaService from "../services/matriculas.service.js";

export const crearMatricula = async (req, res) => {
  try {
    const matricula = await matriculaService.crearMatricula(req.body);
    res.status(201).json(matricula);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listarMatriculas = async (req, res) => {
  const data = await matriculaService.listarMatriculas();
  res.json(data);
};

export const obtenerMatricula = async (req, res) => {
  try {
    const data = await matriculaService.obtenerMatricula(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const actualizarMatricula = async (req, res) => {
  try {
    const data = await matriculaService.actualizarMatricula(
      req.params.id,
      req.body
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cambiarEstadoMatricula = async (req, res) => {
  try {
    const data = await matriculaService.cambiarEstado(
      req.params.id,
      req.body.estado
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listarMisMatriculas = async (req, res) => {
  try {
    const data = await matriculaService.listarMatriculasPorTutor(req.user.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
