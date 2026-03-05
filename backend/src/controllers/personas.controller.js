import { crearPersonaConUsuario, actualizarPersona } from "../services/personas.service.js";

export const registrarPadre = async (req, res) => {
  try {
    const result = await crearPersonaConUsuario({
      tipo: "PADRE",
      ...req.body
    });

    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const registrarTutor = async (req, res) => {
  try {
    const result = await crearPersonaConUsuario({
      tipo: "TUTOR",
      ...req.body
    });

    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const actualizarPadre = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await actualizarPersona({
      tipo: "PADRE",
      persona_id: id,
      ...req.body
    });

    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const actualizarTutor = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await actualizarPersona({
      tipo: "TUTOR",
      persona_id: id,
      ...req.body
    });

    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};