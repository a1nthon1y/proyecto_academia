import * as cursoService from "../services/cursos.service.js";

export const crearCurso = async (req, res) => {
    try {
        const curso = await cursoService.crearCurso(req.body);
        res.status(201).json(curso);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const listarCursos = async (req, res) => {
    try {
        const cursos = await cursoService.listarCursos();
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerCurso = async (req, res) => {
    try {
        const curso = await cursoService.obtenerCurso(req.params.id);
        res.json(curso);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const actualizarCurso = async (req, res) => {
    try {
        const curso = await cursoService.actualizarCurso(req.params.id, req.body);
        res.json(curso);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const eliminarCurso = async (req, res) => {
    try {
        await cursoService.eliminarCurso(req.params.id);
        res.json({ message: "Curso eliminado" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
