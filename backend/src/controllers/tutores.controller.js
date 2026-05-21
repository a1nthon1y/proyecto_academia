import * as tutoresService from "../services/tutores.service.js";
import * as personasService from "../services/personas.service.js";


export const listarTutores = async (req, res) => {
  const incluirInactivos = req.query.incluirInactivos === 'true';
  const tutores = await tutoresService.listarTutores({ incluirInactivos });
  res.json(tutores);
};

export const reactivarTutor = async (req, res) => {
  try {
    const resultado = await tutoresService.reactivarTutor(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const obtenerTutor = async (req, res) => {
  try {
    const tutor = await tutoresService.obtenerTutor(req.params.id);
    res.json(tutor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const crearTutor = async (req, res) => {
  try {
    // Usamos el servicio centralizado de personas para crear usuario + perfil
    const resultado = await personasService.crearPersonaConUsuario({
      ...req.body,
      tipo: 'TUTOR'
    });
    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const eliminarTutor = async (req, res) => {
  try {
    await tutoresService.eliminarTutor(req.params.id);
    res.json({ message: "Tutor eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const actualizarTutor = async (req, res) => {
  try {
    const tutor = await tutoresService.actualizarTutor(
      req.params.id,
      req.body
    );
    res.json(tutor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const obtenerMiPerfil = async (req, res) => {
  try {
    const tutor = await tutoresService.obtenerTutorPorUsuario(req.user.userId);
    res.json(tutor);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const listarDisponibilidad = async (req, res) => {
  try {
    const data = await tutoresService.listarDisponibilidad(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const registrarDisponibilidad = async (req, res) => {
  try {
    const disponibilidad = await tutoresService.registrarDisponibilidad(
      req.params.id,
      req.body
    );
    res.status(201).json(disponibilidad);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
