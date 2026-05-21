import * as padresService from "../services/padres.service.js";
import * as personasService from "../services/personas.service.js";

// PADRE (3) - Obtener su propio perfil
export const obtenerPerfilPadre = async (req, res) => {
  try {
    const perfil = await padresService.obtenerPerfil(req.user.userId);
    res.json(perfil);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
// TRABAJADOR/ADMIN - Nuevos métodos CRUD
export const crearPadre = async (req, res) => {
  try {
    // Usamos el servicio centralizado de personas para crear usuario + perfil
    const resultado = await personasService.crearPersonaConUsuario({
      ...req.body,
      tipo: 'PADRE'
    });

    // Log de auditoría
    /* 
       Nota: logAction se maneja usualmente en el router o middleware, 
       pero si se requiere aquí, se podríainvocar. 
       Asumimos que el middleware lo captura o es suficiente con la respuesta.
    */

    res.status(201).json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const actualizarPadre = async (req, res) => {
  try {
    const resultado = await personasService.actualizarPersona({
      ...req.body,
      tipo: 'PADRE',
      persona_id: req.params.id
    });
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const eliminarPadre = async (req, res) => {
  try {
    const resultado = await padresService.eliminarPadre(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const reactivarPadre = async (req, res) => {
  try {
    const resultado = await padresService.reactivarPadre(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// TRABAJADOR/ADMIN - Listar todos los padres
export const listarPadres = async (req, res) => {
  try {
    const incluirInactivos = req.query.incluirInactivos === 'true';
    const padres = await padresService.listarPadres({ incluirInactivos });
    res.json(padres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PADRE (3) - Listar sus hijos
export const listarMisHijos = async (req, res) => {
  try {
    const hijos = await padresService.listarHijos(req.user.userId);
    res.json(hijos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PADRE (3) - Listar sus asistencias
export const listarMisAsistencias = async (req, res) => {
  try {
    const asistencias = await padresService.listarAsistencias(req.user.userId);
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PADRE (3) - Listar sus tutores asignados
export const listarMisTutores = async (req, res) => {
  try {
    const tutores = await padresService.listarMisTutores(req.user.userId);
    res.json(tutores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
