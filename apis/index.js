const { default: axios } = require("axios");
require("dotenv").config();

const bitrix24Api = axios.create({
  baseURL: process.env.BITRIX,
});

const mondayApi = axios.create({
  baseURL: "https://api.monday.com/v2",
  headers: {
    Authorization: process.env.MONDAY_AUTH,
  },
});

module.exports = {
  bitrix24Api,
  mondayApi,
};
