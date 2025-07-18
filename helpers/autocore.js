const { enviarMensajeGlobal } = require("../helpers/apiWhatSapp");
const accses_key = process.env.ACCESS_KEY;
const secret_key = process.env.SECRET_KEY;

const reservarAutocore = async (datos, hotel_id) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("access_key", accses_key);
    myHeaders.append("secret_key", secret_key);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      ...datos,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    console.log(raw);
    console.log(hotel_id);

    const response = await fetch(
      `https://api.autocore.pro/v2/bookings/hotel_id=${hotel_id}`,
      requestOptions
    );

    const data = await response.json();
    console.log(data);
    if (
      data.msg ==
      "Reserva registrada exitosamente. Por favor realice su pago para confirmar la reserva"
    ) {
      await obtenerLinkPago(data.chatbot_id, datos);
    }
    return data;
  } catch (error) {
    console.log("error al tratar de hacer la reserva: ", error);
  }
};

const obtenerLinkPago = async (id, datos) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("access_key", accses_key);
    myHeaders.append("secret_key", secret_key);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const response = await fetch(
      `https://api.autocore.pro/v2/bookings/chatbot/${id}`,
      requestOptions
    );
    const data = await response.json();
    const url = `?botNum=573336025021&userNum=${datos.reservation.telephone}&templateName=confirmacion_link_reserva&params={"id_reserva":"${id}","link_pago":"${data.url}"}`;
    const mensaje = await enviarMensajeGlobal(url);
    console.log(mensaje);
  } catch (error) {
    console.log("error al obtener el link de pago: ", error);
  }
};

module.exports = {
  reservarAutocore,
};
