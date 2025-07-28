const {
  reservarAutocore,
  enviarMailInnovacion,
  enviarEmailGlobal,
} = require("../helpers/index");

const { enviarMensajeGlobal } = require("../helpers/apiWhatSapp");

const realizarReserva = async (req, res) => {
  const {
    adults,
    checkin,
    checkout,
    children,
    children_ages,
    city,
    email,
    firstName,
    lastName,
    nights,
    telephone,
    roomId,
    rateId,
    rooms,
    hotel_id,
    monto_link
  } = req.body;

  const datos = {
    reservation: {
      adults: adults,
      checkin: checkin,
      checkout: checkout,
      children: children,
      children_ages: children_ages,
      city: city,
      country: "COL",
      currency: "COP",
      email: email,
      firstName: firstName,
      lastName: lastName,
      nights: nights,
      notes: `Reserva de ${nights} noches - agente de ia`,
      rooms: rooms,
      monto_link: monto_link,
      roomsData: [
        {
          adults: adults,
          checkin: checkin,
          checkout: checkout,
          children: children,
          currency: "COP",
          id: roomId,
          quantity: "1",
          rateId: rateId,
        },
      ],
      telephone: telephone,
    },
  };

  // console.log(datos);
  const respuesta = await reservarAutocore(datos, hotel_id);
  res.json({
    respuesta,
  });
};

const enviarCorreoReservas = async (req, res) => {
  const { hotel, fechaEntrada, fechaSalida, nombre, tipoDetalle, numContacto } =
    req.body;

  const mensaje = `Estimado equipo de reservas:

Se ha recibido una nueva solicitud de decoración especial con los siguientes detalles:

INFORMACIÓN DEL CLIENTE
• Cliente: ${nombre}
• Teléfono: ${numContacto}

DETALLES DE LA RESERVA
• Hotel: ${hotel}
• Check-in: ${fechaEntrada}
• Check-out: ${fechaSalida}
• Tipo de decoración: ${tipoDetalle}

Por favor, contactar al cliente para confirmar los detalles y coordinar la decoración solicitada.

Saludos cordiales,
Equipo de Reservas Automatizadas`;

  const correoEnviado = await enviarEmailGlobal(
    mensaje,
    "reservas@gehsuites.com",
    "Nueva solicitud de decoración"
  );
  res.json({
    correoEnviado,
  });
};

const envioContenidoMultimedia = async (req, res) => {
  const { nombre, url, numero } = req.body;

  const urlBot = `?botNum=573336025021&userNum=${numero}&templateName=envio_contenido_multimedia&params={"name":"${nombre}","url":"${url}"}`;
  const mensaje = await enviarMensajeGlobal(urlBot);
  res.json({
    mensaje,
  });
};

module.exports = {
  realizarReserva,
  enviarCorreoReservas,
  envioContenidoMultimedia,
};
