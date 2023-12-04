const Usuario = require("../models/user");
const db = require("./config");

const checkIdUsers = async (id) => {
  await db.connect();
  const user = await Usuario.findOne({ id });
  await db.disconnect();

  if (!user) {
    return false;
  }
  return user;
};

const checkEstadoHuesped = async (id) => {
  const huesped = await checkIdUsers(id);
  if (!huesped.estado) {
    return false;
  }
  return huesped.estado;
};

module.exports = {
  checkIdUsers,
  checkEstadoHuesped,
};
