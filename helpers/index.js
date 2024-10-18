const apiMail = require("../helpers/apiMail");
const apiSMS = require("../helpers/spiSMS");
const bitrixMetodos = require("../helpers/bitrixMetodos");
const hotel = require("../helpers/hotel");
const fechas = require("../helpers/formatFechas");

module.exports = {
  ...apiMail,
  ...apiSMS,
  ...bitrixMetodos,
  ...hotel,
  ...fechas
};
