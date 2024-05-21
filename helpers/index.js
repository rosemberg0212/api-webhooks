const apiMail = require("../helpers/apiMail");
const apiSMS = require("../helpers/spiSMS");
const apiWhatSapp = require("../helpers/apiBotmaker");
const monday = require("./monday");

module.exports = {
  ...apiMail,
  ...apiSMS,
  ...apiWhatSapp,
  ...monday,
};
