const apiMail = require("../helpers/apiMail");
const apiSMS = require("../helpers/spiSMS");
const bitrixMetodos = require("../helpers/bitrixMetodos");
const hotel = require("../helpers/hotel");
const fechas = require("../helpers/formatFechas");
const apiWhatSapp = require("../helpers/apiWhatSapp");
const cobreMetodos = require("../helpers/cobreMetodos");
const autocore = require("../helpers/autocore");

module.exports = {
  ...apiMail,
  ...apiSMS,
  ...bitrixMetodos,
  ...hotel,
  ...fechas,
  ...apiWhatSapp,
  ...cobreMetodos,
  ...autocore
};
