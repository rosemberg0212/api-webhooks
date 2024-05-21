const contactos = require("./contacts");
const prospects = require("./prospectos");

module.exports = {
  ...contactos,
  ...prospects,
};
