const Usuario = require("../models/user");
const db = require("./config");

const checkIdUsers = async (code_reserva) => {
  await db.connect();
  const user = await Usuario.findOne({ code_reserva });
  await db.disconnect();

  if (!user) {
    return false;
  }
  return user;
};

module.exports = {
  checkIdUsers,
};
