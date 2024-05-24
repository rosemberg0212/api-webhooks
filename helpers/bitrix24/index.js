const contactos = require("./contacts");
const negociacionSivil = require("./negociacionSivil");
const general = require("./general");
const spqrs = require("./spqrs");

module.exports = {
  ...contactos,
  ...negociacionSivil,
  ...general,
  ...spqrs,
};
