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

    console.log(datos);
    console.log(hotel_id);
    // await generarLinkPago(datos);
    // const response = await fetch(
    //   `https://api.autocore.pro/v2/bookings/hotel_id=${hotel_id}`,
    //   requestOptions
    // );

    // const data = await response.json();
    // console.log(data);
    // if (
    //   data.msg ==
    //   "Reserva registrada exitosamente. Por favor realice su pago para confirmar la reserva"
    // ) {
    //   await obtenerLinkPago(data.chatbot_id, datos);
    // }
    // return data;
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

const generarLinkPago = async (datos) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("access_key", accses_key);
    myHeaders.append("secret_key", secret_key);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      hotel_id: 9,
      guest_name: `${datos.firstName} ${datos.lastName}`,
      email: "innovacion@gehsuites.com",
      phone: datos.telephone,
      amount: datos.monto_link,
      booking_dates: `${datos.checkin} - ${datos.checkout}`,
      description: `Reserva de ${datos.nights} - agente de IA`,
      available_hours: 100,
      source: "Bitrix24 GehSuites",
      external_ref_id: "test",
      // temp_webhook_url:
      //   "https://gehsuitesapps.com/agencias/v1/reservas/change-status",
      // redirect: {
      //   success_url: "https://agencia.gehsuites.com/misreservas",
      //   failure_url: "https://agencia.gehsuites.com/misreservas",
      // }
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      "https://api.autocore.pro/v2/links/schedule/",
      requestOptions
    );
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("error al generar el link de pago: ", error);
  }
};

module.exports = {
  reservarAutocore,
};
