const { dateComparation } = require("./date");
const dateHelper = { dateComparation };
const apiMail = require('../helpers/apiMail')
const apiSMS = require('../helpers/spiSMS')
const apiWhatSapp = require('../helpers/apiBotmaker')

module.exports = {
  dateHelper,
  ...apiMail,
  ...apiSMS,
  ...apiWhatSapp
};
