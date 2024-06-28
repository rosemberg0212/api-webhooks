
const obtenerDatosB = async (req, res) => {

    const { id } = req.params
    // const id = '2580'
    const api_key = process.env.APIKEY_BITRIX;

    const requestOptions = {
        method: "POST",
        // headers: myHeaders,
        redirect: "follow"
    };

    try {
        const prospecto = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.get.json?ID=${id}`, requestOptions);
        const result = await prospecto.json();
        const data = result.result
        console.log(data);

        const contact_id = data.CONTACT_ID
        // console.log('====////=====////======/////=====//////=====//////')
        const contacto = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.contact.get.json?ID=${contact_id}`, requestOptions);
        const resultContact = await contacto.json()
        // console.log(resultContact)

        const montoApiAutocore = (data.UF_CRM_1719433377306).replace(/\|COP/g, "")
        const nombre = resultContact.result.NAME
        const apellido = resultContact.result.LAST_NAME
        const email = resultContact.result.EMAIL[0].VALUE
        const phone = resultContact.result.PHONE[0].VALUE
        const telefono = phone.replace(/\+/g, "");
        // const noches = data.UF_CRM_1719239960129
        const hotel = data.UF_CRM_1719420631812
        const dealID = data.ID
        let hotel_id = ''
        const porcentajeLink = data.UF_CRM_1719497194288;
        const porcentaje = (montoApiAutocore * porcentajeLink) / 100
        const montoLink = montoApiAutocore - porcentaje
        const gLink = data.UF_CRM_1719507093656;
        const montoConImpuesto = (data.UF_CRM_1719433473082).replace(/\|COP/g, "");
        const checkin = data.UF_CRM_1717100135
        const checkout = data.UF_CRM_1717100323

        const newCheckin = new Date(checkin);
        const newCheckout = new Date(checkout);

        if (newCheckin >= newCheckout) {
            return false;
        }

        const diferencia = newCheckout - newCheckin;

        const noches = diferencia / (1000 * 60 * 60 * 24);

        const descripcion = `Reserva de ${noches} noches`

        switch (hotel) {
            case '6174':
                hotel_id = 9
                break;

            case '6176':
                hotel_id = 6
                break;

            case '6178':
                hotel_id = 1
                break;

            case '6180':
                hotel_id = 7
                break;

            case '6182':
                hotel_id = 5
                break;

            case '6184':
                hotel_id = 4
                break;

            case '6188':
                hotel_id = 3
                break;

            case '6190':
                hotel_id = 10
                break;

            case '6192':
                hotel_id = 8
                break;

            case '6194':
                hotel_id = 2
                break;
            default:
                break;
        }

        const datosLink = {
            montoLink, nombre, apellido, email, telefono, hotel_id, descripcion, dealID, montoApiAutocore, gLink, montoConImpuesto, porcentajeLink
        }

        // console.log(datosLink)
        await generarLink(datosLink)

    } catch (error) {
        console.error(error);
    }

    res.status(200).end();
}

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
            "external_ref_id": datos.dealID
        });
    } else {
        raw = JSON.stringify({
            "hotel_id": datos.hotel_id,
            "guest_name": `${datos.nombre} ${datos.apellido}`,
            "email": datos.email,
            "phone": datos.telefono,
            "amount": datos.montoConImpuesto,
            "description": datos.descripcion,
            "available_hours": 100,
            "source": "Bitrix24 GehSuites",
            "external_ref_id": datos.dealID
        });
    }


    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "access_key": "75Aatc4Z8lLM0cLE",
            "secret_key": "tdQ61vQwvFXlKjh0E9meowYxMnfCi0bC"
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
                "OPPORTUNITY": datos.montoApiAutocore,
                "CURRENCY_ID": 'COP'
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
                "OPPORTUNITY": datos.montoApiAutocore,
                "CURRENCY_ID": 'COP'
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
                "OPPORTUNITY": datos.montoApiAutocore,
                "CURRENCY_ID": 'COP'
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
                "UF_CRM_1719519638392": payment_status
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
                "UF_CRM_1719519638392": payment_status
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