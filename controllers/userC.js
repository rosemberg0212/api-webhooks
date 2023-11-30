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
  const { nombre, hotel, cell, id, checkIn_date, checkOut_date } = req.body;
  const usuario = new Usuario({
    nombre,
    hotel,
    cell,
    id,
    checkIn_date,
    checkOut_date,
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
  const { checkOut_date } = req.body;
  const huesped = await db.checkIdUsers(id);
  if (!huesped) {
    return res.status(404).json({
      code: 404,
      errors: `El huesped con id ${id} no fue encontrado.`,
    });
  }

  if (!checkOut_date) {
    return res.status(400).json({
      code: 400,
      errors: "La fecha del checkout anticipado es necesario.",
    });
  }

  try {
    huesped.checkOut_date = checkOut_date;
    huesped.estado = false;
    await db.connect();
    await huesped.save();
    await db.disconnect();
    return res.status(200).json({
      msg: "Estado cambiado con exito",
    });
  } catch ({ errors }) {
    await db.disconnect();
    return res.status(400).json({
      code: 400,
      errors,
    });
  }
};

const updateHuesped = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  const huesped = await db.checkIdUsers(id);
  if (!huesped) {
    return res.status(404).json({
      code: 404,
      errors: `El huesped con id ${id} no fue encontrado.`,
    });
  }

  if (body.estado) {
    delete body.estado;
  }
  try {
    Object.assign(huesped, body);
    await db.connect();
    await huesped.save();
    await db.disconnect();
    return res.status(200).json({
      msg: "Actualizado con exito",
    });
  } catch ({ errors }) {
    await db.disconnect();
    return res.status(400).json({
      code: 400,
      errors,
    });
  }
};

module.exports = {
  usuariosGet,
  saveHusped,
  createToken,
  changeCheckin,
  updateHuesped,
};
