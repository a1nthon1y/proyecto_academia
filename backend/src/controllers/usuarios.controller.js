import * as usuariosService from "../services/usuarios.service.js";

export const crearUsuarioInterno = async (req, res) => {
  try {
    const usuario = await usuariosService.crearUsuarioInterno(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listarUsuarios = async (req, res) => {
  const usuarios = await usuariosService.listarUsuarios();
  res.json(usuarios);
};

export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.obtenerUsuario(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.actualizarUsuario(
      req.params.id,
      req.body
    );
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cambiarEstadoUsuario = async (req, res) => {
  try {
    const usuario = await usuariosService.cambiarEstadoUsuario(
      req.params.id,
      req.body.activo
    );
    res.json(usuario);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

