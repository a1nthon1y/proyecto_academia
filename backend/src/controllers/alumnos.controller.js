import * as alumnosService from "../services/alumnos.service.js";

export const crearAlumno = async (req, res) => {
  try {
    const alumno = await alumnosService.crearAlumno(req.body);
    res.status(201).json(alumno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listarAlumnos = async (req, res) => {
  try {
    const data = await alumnosService.listarAlumnos();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerAlumno = async (req, res) => {
  try {
    const data = await alumnosService.obtenerAlumno(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const actualizarAlumno = async (req, res) => {
  try {
    const data = await alumnosService.actualizarAlumno(
      req.params.id,
      req.body
    );
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const eliminarAlumno = async (req, res) => {
  try {
    await alumnosService.eliminarAlumno(req.params.id);
    res.json({ message: "Alumno eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// export const desactivarAlumno = async (req, res) => {
//   try {
//     await alumnosService.desactivarAlumno(req.params.id);
//     res.json({ message: "Alumno desactivado" });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
