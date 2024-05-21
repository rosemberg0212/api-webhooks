const { request, response } = require("express");
const { getInfoMonday } = require("../../helpers/monday");
const {
  createContactBitrix,
  createProspectoBitrix,
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
    throw new Error("Problema monday");
  });

  await createProspectoBitrix(data, contacto.id);
  // const propspecto = createProspectoBitrix(data, 123);
  return res.sendStatus(200);
  // return res.status(200).json({propspecto});
};

module.exports = {
  createBitrixSivil,
};
