import * as asistenciaService from "../services/asistencias.service.js";

/**
 * TUTOR registra asistencia con su ubicación GPS
 */
export const registrarAsistenciaTutor = async (req, res) => {
  try {
    const asistencia = await asistenciaService.registrarPorTutor(
      req.user.userId,
      req.body
    );
    res.status(201).json(asistencia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * ADMIN: Registro manual de asistencia
 */
export const registrarAsistenciaAdmin = async (req, res) => {
  try {
    const asistencia = await asistenciaService.registrarPorAdmin(req.body);
    res.status(201).json(asistencia);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Listar todas las asistencias (ADMIN/TRABAJADOR)
 */
export const listarAsistencias = async (req, res) => {
  try {
    const data = await asistenciaService.listarAsistencias();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Listar asistencias del tutor autenticado
 */
export const listarMisAsistencias = async (req, res) => {
  try {
    const data = await asistenciaService.listarAsistenciasPorTutor(req.user.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Listar asistencias para un padre (solo lectura)
 */
export const listarAsistenciasPadre = async (req, res) => {
  try {
    const data = await asistenciaService.listarAsistenciasPorPadre(req.user.userId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
