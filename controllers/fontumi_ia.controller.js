const {reservarAutocore} = require('../helpers/index')

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
    hotel_id
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
  const respuesta = await reservarAutocore(datos, hotel_id)
  res.json({
    respuesta, 
  });
};

module.exports = {
  realizarReserva,
};
