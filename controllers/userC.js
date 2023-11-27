const { response } = require("express");
const Usuario = require("../models/user");
const db = require("../db");

// GET
const usuariosGet = async (req, res = response) => {
  try {
    const users = await Usuario.find();
    res.status(200).json({ users });
  } catch ({ errors }) {
    res.status(400).json({
      code: 400,
      errors,
    });
  }
};

// POST
const usuariosPost = async (req, res = response) => {
  const { nombre, hotel, habitacion, telefono, ciudad, id, codeReserva } =
    req.body;
  const usuario = new Usuario({
    nombre,
    hotel,
    habitacion,
    telefono,
    ciudad,
    id,
    codeReserva,
  });
  const validationUser = await db.checkIdUsers(id);
  if (validationUser) {
    res
      .status(409)
      .json({ code: 409, error: `Usuario con id ${id} ya esta en el sistema` });
    return;
  }

  await db.connect();
  try {
    //Guardar usuario
    await usuario.save();
    await db.disconnect();
    res.status(200).json({
      usuario,
    });
  } catch ({ errors }) {
    await db.disconnect();
    res.status(400).json({
      code: 400,
      errors,
    });
  }
};

const changeCheckIn = async (req, res) => {};

module.exports = {
  usuariosPost,
  usuariosGet,
};
