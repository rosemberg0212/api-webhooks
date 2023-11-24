const enviarWhatsAppBotmaker = async (telefono, descripcionesConcatenadas) => {
  const url = "https://go.botmaker.com/api/v1.0/message/v3";
  const accessToken = process.env.APIKEY_BOTMAKER;

  const datos = {
    chatPlatform: "whatsapp",
    chatChannelNumber: "573044564734",
    platformContactId: telefono,
    messageText: descripcionesConcatenadas,
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "access-token": accessToken,
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(datos),
  };

  try {
    const response = await fetch(url, requestOptions);
    if (response.status === 200) {
      const responseData = await response.json();
      console.log("Respuesta:", responseData);
    } else {
      console.error(
        "Error en la solicitud:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error en la solicitud:", error.message);
  }
};

module.exports = {
  enviarWhatsAppBotmaker,
};
