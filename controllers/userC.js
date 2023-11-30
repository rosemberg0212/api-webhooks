const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/user");
const db = require("../db");
const { dateHelper } = require("../helpers");

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
  const { nombre, hotel, cell, id, code_reserva, checkIn_date, checkOut_date } =
    req.body;
  const usuario = new Usuario({
    nombre,
    hotel,
    cell,
    id,
    code_reserva,
    checkIn_date,
    checkOut_date,
  });

  try {
    await db.connect();
    //Guardar huesped
    await usuario.save();
    await db.disconnect();
    return res.status(201).json({
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
const updateHuesped = async (req = request, res = response) => {
  const { code_reserva } = req.params;
  const { body } = req;
  const huesped = await db.checkIdUsers(code_reserva);
  if (!huesped) {
    return res.status(404).json({
      code: 404,
      errors: `El huesped con code_reserva ${code_reserva} no fue encontrado.`,
    });
  }

  if (body.estado) {
    delete body.estado;
  }
  if (body.code_reserva) {
    delete body.code_reserva;
  }

  if (
    body.checkOut_date &&
    dateHelper.dateComparation(body.checkOut_date, huesped.checkOut_date)
  ) {
    huesped.estado = false;
  } else {
    huesped.estado = true;
  }
  try {
    Object.assign(huesped, body);
    await db.connect();
    await huesped.save();
    await db.disconnect();
    return res.sendStatus(200);
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
  updateHuesped,
};
