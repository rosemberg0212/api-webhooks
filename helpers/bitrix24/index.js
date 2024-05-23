const contactos = require("./contacts");
const prospects = require("./prospectos");
const general = require("./general");
const spqrs = require("./spqrs");

module.exports = {
  ...contactos,
  ...prospects,
  ...general,
  ...spqrs,
};
