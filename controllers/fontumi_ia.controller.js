const {
  reservarAutocore,
  enviarMailInnovacion,
  enviarEmailGlobal
} = require("../helpers/index");

const {enviarMensajeGlobal} = require('../helpers/apiWhatSapp')

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
  const { hotel, fechaCheckin, nombre, tipoDetalle, numContacto } = req.body;

  const mensaje = `Estimado equipo de reservas, 
  Hemos recibido una solicitud de decoración por parte de ${nombre}, los detalles son los siguientes:

  Hotel: ${hotel}
  Fecha de ingreso: ${fechaCheckin}
  Tipo de detalle: ${tipoDetalle} 
  Número de contacto: ${numContacto}

  Ponerse en contacto con el cliente para cualquier validación 
  `;

  const correoEnviado = await enviarEmailGlobal(
    mensaje,
    "innovacion@gehsuites.com",
    "Nueva solicitud de decoración"
  );
  res.json({
    correoEnviado,
  });
};

const envioContenidoMultimedia = async (req, res) => {
  const { nombre, url, numero } = req.body;

  const urlBot = `?botNum=573336025021&userNum=${numero}&templateName=envio_contenido_multimedia&params={"name":"${nombre}","url":"${url}"}`;
  const mensaje = await enviarMensajeGlobal(urlBot)
  res.json({
    mensaje
  })
};



module.exports = {
  realizarReserva,
  enviarCorreoReservas,
  envioContenidoMultimedia
};
