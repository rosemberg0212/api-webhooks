const { connect, disconnect } = require("./config");
const { checkIdUsers, checkEstadoHuesped } = require("./dbUsers");
const db = { connect, disconnect, checkIdUsers, checkEstadoHuesped };
module.exports = db;
