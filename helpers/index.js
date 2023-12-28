const { dateComparation, getActualDate } = require("./date");
const dateHelper = { dateComparation, getActualDate};
const apiMail = require('../helpers/apiMail')
const apiSMS = require('../helpers/spiSMS')
const apiWhatSapp = require('../helpers/apiBotmaker')

module.exports = {
  dateHelper,
  ...apiMail,
  ...apiSMS,
  ...apiWhatSapp
};
