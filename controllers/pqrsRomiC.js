const { enviarHorarioWhatsApp } = require("../helpers/apiBotmaker");
const enviarFormPQRS = async (req, res) => {
  const challenge = req.body.challenge;
  res.send({ challenge });

  const id = req.body.event.pulseId;

  const query = `query { boards(ids: 5469236502) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.APIKEY_MONDAY,
    },
    body: JSON.stringify({
      query: query,
    }),
  });
  try {
    if (response.ok) {
      const { data } = await response.json();
      const statusPeticion = data.boards[0].items[0].column_values[1].text;
      const categoria = data.boards[0].items[0].column_values[2].text;
      const anotacion = data.boards[0].items[0].column_values[3].text;
      const telefono = data.boards[0].items[0].column_values[4].text;

      // ?  Romi
      await enviarHorarioWhatsApp(
        telefono,
        `El estado de su orden *${categoria}* es: *${statusPeticion}*.`
      );
    } else {
      console.error("Hubo un error en la solicitud.");
      console.error("Código de estado:", response.status);
      const errorMessage = await response.text();
      console.error("Respuesta:", errorMessage);
    }
  } catch (error) {
    console.error("Hubo un error en la solicitud:", error);
  }

  res.status(200).end();
};

module.exports = {
  enviarFormPQRS,
};
