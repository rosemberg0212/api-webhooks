const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/user");
const db = require("../db");

// GET
const usuariosGet = async (req, res = response) => {
  try {
    db.connect();
    const huesped = await Usuario.find();
    db.disconnect();
    res.status(200).json({ huesped });
  } catch ({ errors }) {
    db.disconnect();
    res.status(400).json({
      code: 400,
      errors,
    });
  }
};

// Guardar huesped
const saveHusped = async (req, res = response) => {
  const {
    nombre,
    hotel,
    telefono,
    ciudad,
    id,
    codeReserva,
    checkin,
    checkout,
  } = req.body;
  const usuario = new Usuario({
    nombre,
    hotel,
    telefono,
    ciudad,
    id,
    codeReserva,
    checkin,
    checkout,
  });

  try {
    await db.connect();
    //Guardar huesped
    await usuario.save();
    await db.disconnect();
    return res.status(200).json({
      msg: "El huesped fue guardado de manera exitosa",
    });
  } catch ({ errors }) {
    await db.disconnect();
    return res.status(400).json({
      code: 400,
      errors,
    });
  }
};

const createToken = (req, res = response) => {
  const { userName } = req.body;

  const accessClientId = jwt.sign(userName, process.env.ACCES_TOKEN_SECRET);
  return res.status(200).json({ accessClientId });
};
// PUT salida anticipada
const changeCheckin = async (req = request, res = response) => {
  const { id } = req.params;
  const huesped = await db.checkIdUsers(id);
  if (!huesped) {
    return res.status(404).json({
      code: 404,
      errors: `El huesped con id ${id} no fue encontrado.`,
    });
  }

  try {
    huesped.estado = false;
    await db.connect();
    await huesped.save();
    await db.disconnect();
    return res.status(200).json({
      code: 200,
      msg: "Estado cambiado con exito",
    });
  } catch ({ errors }) {
    await db.disconnect();
    return res.status(400).json({
      code: 404,
      errors,
    });
  }
};

const updateHuesped = async (req = request, res = response) => {};

module.exports = {
  usuariosGet,
  saveHusped,
  createToken,
  changeCheckin,
};
