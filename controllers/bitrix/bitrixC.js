const { request, response } = require("express");
const { getInfoMonday } = require("../../helpers/monday");
const {
  createContactBitrix,
  createnegociacionBitrix,
  obtenerContacto,
  createSpqrBitrix,
} = require("../../helpers/bitrix24");
require("dotenv").config();

const createBitrixSivil = async (req = request, res = response) => {
  const challenge = req.body.challenge;
  res.send({ challenge });
  // const { pulseId, boardId } = req.body.event;
  const pulseId = req.body.event.pulseId;
  const boardId = req.body.event.boardId;

  const { data } = await getInfoMonday({
    boardId,
    pulseId,
  }).catch((res) => {
    throw new Error("Problema monday");
  });

  const contacto = await createContactBitrix(data).catch((res) => {
    throw new Error("Problema bitrix");
  });

  await createnegociacionBitrix(data, contacto.id);
  // const propspecto = createProspectoBitrix(data, 123);
  return res.sendStatus(200);
  // return res.status(200).json({propspecto});
};

const createBitrixSPQR = async (req = request, res = response) => {
  const { challenge } = req.body;
  res.send({ challenge });
  const pulseId = req.body.event.pulseId;
  const boardId = req.body.event.boardId;
  // const { pulseId, boardId } = req.body.event;

  const { data } = await getInfoMonday({
    boardId,
    pulseId,
  }).catch((res) => {
    throw new Error("Problema monday");
  });
  const phone = data.column_values.find((i) => i.id === "phone")?.text || null;

  const email =
    data.column_values.find((i) => i.id === "correo_electr_nico")?.text || null;

  const contactId = await obtenerContacto({
    select: ["ID", "PHONE", "EMAIL"],
    phone,
    email,
  });

  await createSpqrBitrix(data, contactId);
  return res.sendStatus(200);
};

module.exports = {
  createBitrixSivil,
  createBitrixSPQR,
};
