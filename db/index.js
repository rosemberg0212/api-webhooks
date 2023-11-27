const { connect, disconnect } = require("./config");
const { checkIdUsers } = require("./dbUsers");
const db = { connect, disconnect, checkIdUsers };
module.exports = db;
