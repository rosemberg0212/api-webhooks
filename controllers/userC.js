const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/user");
const db = require("../db");

// GET
const usuariosGet = async (req, res = response) => {
  try {
    db.connect();
    const users = await Usuario.find();
    db.disconnect();
    res.status(200).json({ users });
  } catch ({ errors }) {
    db.disconnect();
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

  try {
    await db.connect();
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

const createToken = (req, res = response) => {
  const { userName } = req.body;

  const accessClientId = jwt.sign(userName, process.env.ACCES_TOKEN_SECRET);
  res.status(200).json({ accessClientId });
};

// PUT
const switchCheckIn = async (req, res = response) => {
  const { id } = req.body;

  try {
    const user = await db.checkIdUsers(id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        error: `No se pudo encontrar al huesped con id ${id} en el sistema`,
      });
    }
    user.checkin = false;
    db.connect();
    await user.save();
    db.disconnect();
    return res.status(200).json({ msg: "El huesped ha pasado a chechout" });
  } catch (errors) {
    await db.disconnect();
    res.status(400).json({
      code: 400,
      errors,
    });
  }
};

module.exports = {
  usuariosGet,
  usuariosPost,
  createToken,
  switchCheckIn,
};
