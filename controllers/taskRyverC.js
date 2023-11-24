const { enviarWhatsAppBotmaker } = require("../helpers/apiBotmaker");

const infoRyver = async (req, res) => {
  const challenge = req.body.challenge;
  res.send({ challenge });
  const { data } = req.body;
  const desc = data.entity.subject;
  const category = data.entity.category.descriptor;
  const telefono = desc.split(" - ")[1];
  const servicio = desc.split(" - ")[0];

  console.log(data.entity);
  try {
    await enviarWhatsAppBotmaker(
      telefono,
      `Hola, tu servicio de ${servicio} ha pasado a ${category}`
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  infoRyver,
};
