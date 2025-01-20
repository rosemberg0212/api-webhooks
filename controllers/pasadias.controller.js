const { getListPasadias, getListContact, crearNegociacion, crearContact, enviarWhatSapp, moveMoney, updateDeal, enviarMailInnovacion } = require('../helpers/index')

const crearPasadias = async (req, res) => {

    const { ...body } = req.body
    // console.log(body)
    const getPasadias = await getListPasadias()
    const getContactos = await getListContact()
    const validarDisponibilidad = getPasadias.some((dato) => (dato.UF_CRM_1714769540).replace(/T.*/, '') == body.fecha)
    const mensaje = validarDisponibilidad ? 'Fechas no disponibles' : 'Fechas disponibles';

    const contactoEncontrado = getContactos?.find((dato) =>
        dato?.EMAIL?.some((mail) => mail.VALUE === body.mail)
    );
    const precioNinos = 108000;
    const precioAdultos = 135000;

    const cotizacion = (pNinos, pAdultos, cNinos, cAdultos) => {
        const totalNino = pNinos * cNinos;
        const totalAdultos = pAdultos * cAdultos;
        return {
            totalNino, totalAdultos, total: Number(totalAdultos + totalNino)
        }
    }

    const totalCotizacion = cotizacion(precioNinos, precioAdultos, body.numero_ninos, body.numero_adultos)
    console.log(totalCotizacion)

    if (contactoEncontrado) {
        console.log(`El correo ya existe, ID del contacto: ${contactoEncontrado.ID}`);
        const datos = {
            fields: {
                TITLE: body.name,
                STAGE_ID: "NEW",
                CATEGORY_ID: 28, // ID del pipeline donde se creará la negociación
                CURRENCY_ID: "COP",
                OPPORTUNITY: totalCotizacion.total,
                CONTACT_ID: contactoEncontrado.ID,
                CATEGORY_ID: 28,
                UF_CRM_1714769540: body.fecha,
                UF_CRM_1715802347: body.numero_ninos || 0,
                UF_CRM_1718392639543: body.numero_adultos || 0,
                UF_CRM_1719433377306: totalCotizacion.totalNino,
                UF_CRM_1719433473082: totalCotizacion.totalAdultos
            },
        }
        const params = {
            celular: body.celular,
            name: body.name,
            numero_ninos: body.numero_ninos || 0,
            precio_ninos: precioNinos,
            subTotal_ninos: totalCotizacion.totalNino,
            numero_adultos: body.numero_adultos || 0,
            precio_adultos: precioAdultos,
            subTotal_adultos: totalCotizacion.totalAdultos,
            valor_total: totalCotizacion.total,
            url: 'www'
        }
        const negociacion = await crearNegociacion(datos)
        const linkPago = await moveMoney(totalCotizacion.total, negociacion)
        console.log(linkPago)
        await enviarWhatSapp(params, linkPago.metadata.payment_link)
        const cuerpo = `
        Estimado/a ${params.name},

        Gracias por elegir nuestros servicios para disfrutar de un día especial. A continuación, te compartimos la cotización detallada para tu pasadía:

        Detalle de la Cotización
        Cantidad de niños: ${params.numero_ninos}
        Precio por niño: ${params.precio_ninos}
        Subtotal niños: ${params.subTotal_ninos}

        Cantidad de adultos: ${params.numero_adultos}
        Precio por adulto: ${params.precio_adultos}
        Subtotal adultos: ${params.subTotal_adultos}

        Total General: ${params.valor_total}

        Realiza tu Pago Aquí
        Para confirmar tu reserva, por favor realiza el pago del pasadía utilizando el siguiente enlace: ${linkPago.metadata.payment_link}
        `
        await enviarMailInnovacion(cuerpo, body.mail, 'Cotización de Pasadía')
    } else {
        console.log("El correo no existe");
        const datos = {
            name: body.name,
            mail: body.mail,
            celular: body.celular
        }
        const contactId = await crearContact(datos)
        const datosNegociacion = {
            fields: {
                TITLE: body.name,
                STAGE_ID: "NEW",
                CATEGORY_ID: 28, // ID del pipeline donde se creará la negociación
                CURRENCY_ID: "COP",
                OPPORTUNITY: totalCotizacion.total,
                CONTACT_ID: contactId,
                CATEGORY_ID: 28,
                UF_CRM_1714769540: body.fecha,
                UF_CRM_1715802347: body.numero_ninos,
                UF_CRM_1718392639543: body.numero_adultos,
                UF_CRM_1719433377306: totalCotizacion.totalNino,
                UF_CRM_1719433473082: totalCotizacion.totalAdultos
            },
        }

        const params = {
            celular: body.celular,
            name: body.name,
            numero_ninos: body.numero_ninos,
            precio_ninos: precioNinos,
            subTotal_ninos: totalCotizacion.totalNino,
            numero_adultos: body.numero_adultos,
            precio_adultos: precioAdultos,
            subTotal_adultos: totalCotizacion.totalAdultos,
            valor_total: totalCotizacion.total,
            url: 'www'
        }
        const negociacion = await crearNegociacion(datosNegociacion)
        const linkPago = await moveMoney(totalCotizacion.total, negociacion)
        console.log(linkPago)
        await enviarWhatSapp(params, linkPago.metadata.payment_link)
        const cuerpo = `
        Estimado/a ${params.name},

        Gracias por elegir nuestros servicios para disfrutar de un día especial. A continuación, te compartimos la cotización detallada para tu pasadía:

        Detalle de la Cotización
        Cantidad de niños: ${params.numero_ninos}
        Precio por niño: ${params.precio_ninos}
        Subtotal niños: ${params.subTotal_ninos}

        Cantidad de adultos: ${params.numero_adultos}
        Precio por adulto: ${params.precio_adultos}
        Subtotal adultos: ${params.subTotal_adultos}

        Total General: ${params.valor_total}

        Realiza tu Pago Aquí
        Para confirmar tu reserva, por favor realiza el pago del pasadía utilizando el siguiente enlace: ${linkPago.metadata.payment_link}
        `
        await enviarMailInnovacion(cuerpo, body.mail, 'Cotización de Pasadía')
    }

    res.status(200).end();
}

const obtenerPago = async (req, res) => {
    const { ...body } = req.body
    const datos = {
        id: body.content.external_id ,
        status: body.content.status.state ,
        amount: body.content.amount,
        fecha_evento: body.created_at ,
        referencia: body.content.id 
    }
    await updateDeal(datos)
    console.log(body)
}

module.exports = {
    crearPasadias,
    obtenerPago
}