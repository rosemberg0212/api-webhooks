const { getDeal, getContact, hotelId, separarDias, calcularNoches} = require('../helpers/index')
const accses_key = process.env.ACCESS_KEY;
const secret_key = process.env.SECRET_KEY;
//#region Obtener datos para generar link 
const obtenerDatosB = async (req, res) => {

    const { id } = req.params

    try {
        const data = await getDeal(id);
        const contact_id = data.CONTACT_ID
        const resultContact = await getContact(contact_id);
        // console.log(resultContact)

        const hotel = data.UF_CRM_1716497043303
        const porcentajeLink = data.UF_CRM_1719497194288;
        const montoConImpuesto = (data.UF_CRM_1719433473082).replace(/\|COP/g, "");
        const porcentaje = (montoConImpuesto * porcentajeLink) / 100;
        const formateCheckin = (data.UF_CRM_1717100135).replace(/T.*/, '');
        const formateCheckout = (data.UF_CRM_1717100323).replace(/T.*/, '');
        const booking_dates = `${formateCheckin} - ${formateCheckout}`
        const fechasConvertidas = separarDias(formateCheckin, formateCheckout)
        console.log(fechasConvertidas)
        const noches = calcularNoches(formateCheckin, formateCheckout)
        const descripcion = `Reserva de ${noches.noches} noches`

        const datosLink = {
            montoLink: porcentaje,
            nombre: resultContact.result.NAME,
            apellido: resultContact.result.LAST_NAME,
            email: resultContact.result.EMAIL[0].VALUE,
            telefono: (resultContact.result.PHONE[0].VALUE).replace(/\+/g, ""),
            hotel_id: hotelId(hotel),
            descripcion,
            dealID: data.ID,
            montoSinImpuestos: (data.UF_CRM_1719433377306).replace(/\|COP/g, ""),
            gLink: data.UF_CRM_1719507093656,
            montoConImpuesto,
            porcentajeLink,
            booking_dates,
            fechasConvertidas,
            localizador: data.UF_CRM_1755027828331
        }

        console.log(datosLink)
        await generarLink(datosLink)

    } catch (error) {
        console.error(error);
    }

    res.status(200).end();
}

//#region generar link
const generarLink = async (datos) => {
    const api_key = process.env.APIKEY_BITRIX;
    console.log(datos)

    // const myHeaders = new Headers()
    // myHeaders.append("Content-Type", "application/json");
    let raw = ''
    if (datos.porcentajeLink) {

        raw = JSON.stringify({
            "hotel_id": datos.hotel_id,
            "guest_name": `${datos.nombre} ${datos.apellido}`,
            "email": datos.email,
            "phone": datos.telefono,
            "amount": datos.montoLink,
            "description": datos.descripcion,
            "available_hours": 100,
            "source": "Bitrix24 GehSuites",
            "external_ref_id": datos.dealID,
            "booking_dates": datos.booking_dates,
            "reservation_id": datos.localizador
        });
    } else {
        raw = JSON.stringify({
            "hotel_id": datos.hotel_id,
            "guest_name": `${datos.nombre} ${datos.apellido}`,
            "email": datos.email,
            "phone": datos.telefono,
            "amount": datos.montoConImpuesto,
            "description": datos.descripcion,
            "available_hours": 3652,
            "source": "Bitrix24 GehSuites",
            "external_ref_id": datos.dealID,
            "booking_dates": datos.booking_dates,
            "reservation_id": datos.localizador
        });
    }


    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "access_key": accses_key,
            "secret_key": secret_key
        },
        body: raw,
    };

    if (datos.gLink == '1' && datos.porcentajeLink == '') {
        const geLink = await fetch(`https://api.autocore.pro/v2/links/schedule/`, requestOptions);
        const res = await geLink.json()
        console.log(res)

        // actualizar campo link de pago
        const linkPago = JSON.stringify({
            "fields": {
                "UF_CRM_1719255922011": res.url,
                "UF_CRM_1719322536900": datos.montoConImpuesto,
                "OPPORTUNITY": datos.montoSinImpuestos,
                "CURRENCY_ID": 'COP',
                "UF_CRM_1719938839622": datos.fechasConvertidas.diaCkin,
                "UF_CRM_1719938921840": datos.fechasConvertidas.diaCkout,
                "UF_CRM_1719939072554": datos.fechasConvertidas.nombreMes
            }
        })

        const update = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.update?ID=${datos.dealID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: linkPago
        });
        const resUpdate = await update.json()
        // console.log(resUpdate)

    } else if (datos.gLink == '1') {
        const geLink = await fetch(`https://api.autocore.pro/v2/links/schedule/`, requestOptions);
        const res = await geLink.json()
        console.log(res)

        // actualizar campo link de pago
        const linkPago = JSON.stringify({
            "fields": {
                "UF_CRM_1719255922011": res.url,
                "UF_CRM_1719322536900": datos.montoLink,
                "OPPORTUNITY": datos.montoSinImpuestos,
                "CURRENCY_ID": 'COP',
                "UF_CRM_1719938839622": datos.fechasConvertidas.diaCkin,
                "UF_CRM_1719938921840": datos.fechasConvertidas.diaCkout,
                "UF_CRM_1719939072554": datos.fechasConvertidas.nombreMes
            }
        })

        const update = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.update?ID=${datos.dealID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: linkPago
        });
        const resUpdate = await update.json()
        // console.log(resUpdate)
    } else {
        // actualizar campo link de pago
        const linkPago = JSON.stringify({
            "fields": {
                "UF_CRM_1719255922011": '',
                "UF_CRM_1719322536900": '0',
                "OPPORTUNITY": datos.montoSinImpuestos,
                "CURRENCY_ID": 'COP',
                "UF_CRM_1719938839622": datos.fechasConvertidas.diaCkin,
                "UF_CRM_1719938921840": datos.fechasConvertidas.diaCkout,
                "UF_CRM_1719939072554": datos.fechasConvertidas.nombreMes
            }
        })

        const update = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.update?ID=${datos.dealID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: linkPago
        });
        const resUpdate = await update.json()
        // console.log(resUpdate)
    }

}

//#region actualizar datos pagos
const actualizarDatosPagos = async (req, res) => {

    const api_key = process.env.APIKEY_BITRIX;
    const { payment_status, amount, payment_date, company, hotel, voucher_url, transaction_id, external_ref_id } = req.body
    let company_id

    switch (company) {
        case 'CARIBE HOTELES':
            company_id = '6144'
            break;

        case 'DT HOTELES':
            company_id = '6146'
            break;

        case 'ECONO HOTEL GROUP':
            company_id = '6142'
            break;

        case 'SMART STAY SAS':
            company_id = '6148'
            break;

        case 'SOCIEDAD HOTELERA FAM SAS':
            company_id = '6154'
            break;
        default:
            break;
    }
    let hotel_id
    switch (hotel) {
        case 'Hotel Azuan Suites':
            hotel_id = '5276'
            break;

        case 'Hotel 1525 By Gh Suites':
            hotel_id = '5296'
            break;

        case 'Madisson Inn Hotel & Luxury Suites':
            hotel_id = '5290'
            break;

        case 'Hotel Abi Inn':
            hotel_id = '5280'
            break;

        case 'Hotel Avexi Suites':
            hotel_id = '5274'
            break;
        case 'Hotel Aixo Suites':
            hotel_id = '5282'
            break;
        case 'Bocagrande Cartagena':
            hotel_id = '5278'
            break;
        case 'Hotel Rodadero Inn':
            hotel_id = '5294'
            break;
        case 'Hotel Marina Suites':
            hotel_id = '5272'
            break;
        case 'MT Hotel Windsor House Inn By GEH Suites':
            hotel_id = '5292'
            break;
        default:
            break;
    }
    if (payment_status == 'Aplicado') {

        const datos = JSON.stringify({
            "fields": {
                "UF_CRM_1718396179138": amount,
                "UF_CRM_1718396297448": payment_date,
                "UF_CRM_1718397018945": transaction_id,
                "UF_CRM_1719335914": company_id,
                "UF_CRM_1718636597": [hotel_id],
                "UF_CRM_1719422000266": voucher_url,
                "UF_CRM_1719519638392": payment_status,
                "UF_CRM_1718394865311": "5204",
                "UF_CRM_1718396464904": "5208",
                "STAGE_ID": "UC_D6ERFN"
            }
        })

        try {
            const update = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.update?ID=${external_ref_id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: datos
            });
            const resUpdate = await update.json();
            res.json({
                msg: resUpdate.result
            })
            console.log(resUpdate)

        } catch (error) {
            console.log(error)
        }
    } else if (payment_status == 'Rechazado' || payment_status == 'Tarjeta no válida') {
        const datos = JSON.stringify({
            "fields": {
                "UF_CRM_1718396179138": 0,
                "UF_CRM_1718396297448": '',
                "UF_CRM_1718397018945": '',
                "UF_CRM_1719335914": '',
                "UF_CRM_1718636597": [],
                "UF_CRM_1719422000266": '',
                "UF_CRM_1719519638392": payment_status,
                "UF_CRM_1718394865311": "",
                "UF_CRM_1718396464904": ""
            }
        })

        try {
            const update = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.update?ID=${external_ref_id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: datos
            });
            const resUpdate = await update.json();
            res.json({
                msg: resUpdate.result
            })
            console.log(resUpdate)

        } catch (error) {
            console.log(error)
        }
    }

    res.status(200).end();
}

module.exports = {
    obtenerDatosB,
    actualizarDatosPagos
}