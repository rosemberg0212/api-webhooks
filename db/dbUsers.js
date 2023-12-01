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

module.exports = {
  checkIdUsers,
};
