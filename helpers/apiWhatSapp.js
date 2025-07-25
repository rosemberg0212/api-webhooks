const enviarWhatSapp = async (datos, linkPago) => {
  // console.log(datos)
  try {
    const requestOptions = {
      method: "POST",
    };

    const response = await fetch(
      `http://143.198.118.131:8083/api/mensaje?botNum=573336025021&userNum=${datos.celular}&templateName=pasadia&params={"name": "${datos.name}", "numero_ninos": ${datos.numero_ninos}, "precio_ninos": ${datos.precio_ninos}, "subTotal_ninos": ${datos.subTotal_ninos}, "numero_adultos": ${datos.numero_adultos}, "precio_adultos": ${datos.precio_adultos}, "subTotal_adultos": ${datos.subTotal_adultos}, "valor_total": ${datos.valor_total}, "url": "${linkPago}"}`,
      requestOptions
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.log("Ocurrio un error al enviar ws", error);
    }
  } catch (error) {
    console.log("Ocurrio un error", error);
  }
};

const confirmacionPago = async (datos) => {
  console.log(datos);
  try {
    const requestOptions = {
      method: "POST",
    };

    const response = await fetch(
      `http://143.198.118.131:8083/api/mensaje?botNum=573336025021&userNum=${datos.celular}&templateName=confirmacion_pago_pasadias&params={"fecha": "${datos.fecha}", "numero_adultos": "${datos.num_adultos}", "numero_ninos": "${datos.num_ninos}", "hotel": "${datos.hotel}"}`,
      requestOptions
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.log("Ocurrio un error al enviar ws", error);
    }
  } catch (error) {
    console.log("Ocurrio un error", error);
  }
};

const mensajeAlex = async (datos) => {
  console.log(datos);
  try {
    const requestOptions = {
      method: "POST",
    };

    const response = await fetch(
      `http://143.198.118.131:8083/api/mensaje?botNum=573336025414&userNum=${datos.numeroUser}&templateName=notificacion_pago_alex&params={"hotel": "${datos.proveedor}", "empresa": "${datos.empresa}","monto":"${datos.monto}","fecha":"${datos.fecha}"}`,
      requestOptions
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.log("Ocurrio un error al enviar ws", error);
    }
  } catch (error) {
    console.log("Ocurrio un error", error);
  }
};

const enviarMensajeGlobal = async (datos) => {
  console.log(datos);
  try {
    const requestOptions = {
      method: "POST",
    };

    const response = await fetch(`http://143.198.118.131:8083/api/mensaje${datos}`, requestOptions);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data
    } else {
      console.log("Ocurrio un error al enviar ws", error);
    }
  } catch (error) {
    console.log("Ocurrio un error", error);
  }
};

module.exports = {
  enviarWhatSapp,
  confirmacionPago,
  mensajeAlex,
  enviarMensajeGlobal,
};
