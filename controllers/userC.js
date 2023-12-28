const { request, response } = require("express");
const { enviarWhatsTemplate } = require("../helpers/apiBotmaker");
// Nuevos terminos de la api
const checkInGreetings = async (req = request, res = response) => {
  const { hotel, cell } = req.body;
  try {
    return await enviarWhatsTemplate(cell, "573336025021", "salud_romi_guess", {
      hotel_guess: hotel,
    }).then(() => res.sendStatus(200));
  } catch (err) {
    res.json({
      errors,
    });
  }
};

const checkOut = async (req = request, res = response) => {
  const encuestas = [
    {
      hotel: "Aixo",
      url: "https://wkf.ms/3jE6Ii3",
    },
    {
      hotel: "Azuan",
      url: "https://wkf.ms/3lccnfF",
    },
    {
      hotel: "Bocagrande",
      url: "https://wkf.ms/3REt7rW",
    },
    {
      hotel: "Avexi",
      url: "https://wkf.ms/3jIfMTa",
    },
    {
      hotel: "Marina",
      url: "https://wkf.ms/3DSi4Wv",
    },
    {
      hotel: "Madisson",
      url: "https://wkf.ms/3YwAkg6",
    },
    {
      hotel: "1525",
      url: "https://wkf.ms/3DQQk4P",
    },
    {
      hotel: "Boquilla",
      url: "https://wkf.ms/3XkVJb4",
    },
    {
      hotel: "Abi Inn",
      url: "https://wkf.ms/3owH40E",
    },
    {
      hotel: "Windsor",
      url: "https://wkf.ms/3RtTC51",
    },
    {
      hotel: "Rodadero",
      url: "https://wkf.ms/3tqKWn1",
    },
  ];
  const { hotel, cell } = req.body;

  try {
    const encuesta = encuestas.find((url) => url.hotel === hotel);
    if (!encuesta) {
      return res.status(400).json({
        error: `No se encontro coincidencia para el hotel ${hotel}`,
      });
    }
    const { url } = encuesta;
    return await enviarWhatsTemplate(cell, "573336025021", "despedida_encuesta", {
      hotel_guess: hotel,
      url,
    }).then(() => res.sendStatus(200));
  } catch (err) {
    res.json({
      errors,
    });
  }
};

module.exports = {
  checkInGreetings,
  checkOut,
};
