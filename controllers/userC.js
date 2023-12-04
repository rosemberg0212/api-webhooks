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
    res.json({
      errors,
    });
  }
};

// Guardar huesped
const saveHusped = async (req, res = response) => {
  const {
    nombre,
    primerApellido,
    hotel,
    habitacion,
    cell,
    id,
    code_reserva,
    checkIn_date,
    checkOut_date,
  } = req.body;
  const usuario = new Usuario({
    nombre,
    primerApellido,
    hotel,
    habitacion,
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
    return res.json({
      errors,
    });
  }
};

const createToken = (req, res = response) => {
  const { userName } = req.body;

  const accessClientId = jwt.sign(userName, process.env.ACCES_TOKEN_SECRET);
  return res.status(200).json({ accessClientId });
};

// Updatear huesped
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
    return res.json({
      errors,
    });
  }
};

const checkOutHabitacion = async (req = request, res = response) => {
  const { hotel } = req.params;
  const { habitacion } = req.query;

  try {
    db.connect();
    await Usuario.updateMany(
      { hotel, habitacion, estado: true },
      { $set: { estado: false } }
    );
    db.disconnect();

    res.sendStatus(200);
  } catch ({ errors }) {
    db.disconnect();
    return res.json({
      errors,
    });
  }
};

// ? Rutas para desarrollo

const findOneHuesped = async (req, res) => {
  const { id } = req.params;
  try {
    const huesped = await db.checkIdUsers(id);
    if (!huesped) {
      return res.status(404).json({
        code: 404,
        errors: `El huesped con id ${id} no fue encontrado.`,
      });
    }
    return res.status(200).json({ huesped });
  } catch ({ errors }) {
    return res.json({
      errors,
    });
  }
};

const gethuespedEstado = async (req = request, res) => {
  const { id } = req.params;
  try {
    const huespedEstado = await db.checkEstadoHuesped(id);
    res.status(200).json({ huespedEstado });
  } catch ({ errors }) {
    res.json({
      errors,
    });
  }
};

module.exports = {
  usuariosGet,
  saveHusped,
  createToken,
  updateHuesped,
  checkOutHabitacion,
  // ?Rutas de desarrollo
  findOneHuesped,
  gethuespedEstado
};
