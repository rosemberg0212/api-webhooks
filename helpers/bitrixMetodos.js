
const URL = 'https://gehsuites.bitrix24.com/rest/14'
const apiKey = process.env.APIKEY_BITRIX;

const { confirmacionPago } = require('./apiWhatSapp')
const getDeal = async (id) => {

    try {
        // const { id } = req.params
        // const id = '2580'
        const api_key = process.env.APIKEY_BITRIX;

        const requestOptions = {
            method: "POST",
            // headers: myHeaders,
            redirect: "follow"
        };

        const prospecto = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.get.json?ID=${id}`, requestOptions);
        if (prospecto.ok) {
            const result = await prospecto.json();
            const data = result.result
            return data
        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', prospecto.status);
            const errorMessage = await prospecto.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.log(error)
    }
}

const getContact = async (id) => {

    try {
        const api_key = process.env.APIKEY_BITRIX;

        const requestOptions = {
            method: "POST",
            // headers: myHeaders,
            redirect: "follow"
        };

        const contacto = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.contact.get.json?ID=${id}`, requestOptions);
        if (contacto.ok) {
            const result = await contacto.json();
            return result
        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', contacto.status);
            const errorMessage = await contacto.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.log(error)
    }
}

const getCompany = async (id) => {

    try {
        const api_key = process.env.APIKEY_BITRIX;

        const requestOptions = {
            method: "POST",
            // headers: myHeaders,
            redirect: "follow"
        };

        const prospecto = await fetch(`${URL}/${api_key}/crm.company.get.json?ID=${id}`, requestOptions);
        if (prospecto.ok) {
            const result = await prospecto.json();
            const data = result.result
            return data
        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', prospecto.status);
            const errorMessage = await prospecto.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.log(error)
    }
}

const addDeal = async (hotelID, datos, url) => {
    const api_key = process.env.APIKEY_BITRIX;
    const apiUrl = `https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.add`;
    const date = new Date()
    const dealData = {
        fields: {
            TITLE: "Recibo Público", // Título de la negociación
            TYPE_ID: "GOODS",
            CATEGORY_ID: '54',
            STAGE_ID: "NEW",            // Estado inicial de la negociación
            OPPORTUNITY: datos.valor_total_a_pagar,
            // CURRENCY_ID: "USD",         // Moneda
            BEGINDATE: date,    // Fecha de inicio
            CONTACT_ID: hotelID,
            UF_CRM_1730310923: datos.empresa, //empresa servicio     
            UF_CRM_1730310720: datos.tipo_servicio, //tipo servicio 
            UF_CRM_1730308537: datos.numero_contrato, //n contrato
            UF_CRM_1719500807709: datos.fecha_limite_pago, //fecha limite pago
            UF_CRM_1730308870: datos.periodo_consumo,
            UF_CRM_1730321299: datos.valor_consumo, //valor consumo
            UF_CRM_1732038391218: datos.valor_servicios,
            UF_CRM_1718739210: [datos.valor_total_a_pagar], //valor total
            UF_CRM_1731705380746: url,
            UF_CRM_1732893904504: datos.iva || 0

        },
        params: { REGISTER_SONET_EVENT: "Y" } // Registra el evento en el flujo de actividades
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dealData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log(`Negociación creada con ID: ${result.result}`);
        } else {
            console.error("Error al crear la negociación:", result);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

const getListDeal = async (id) => {

    try {
        let start = 0;
        let allDeals = [];
        let hasMore = true;
        const api_key = process.env.APIKEY_BITRIX;

        const requestOptions = {
            method: "POST",
            // headers: myHeaders,
            redirect: "follow"
        };
        while (hasMore) {

            const response = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.deal.list.json?FILTER[STAGE_ID]=C6:WON&SELECT[]=TITLE&SELECT[]=UF_CRM_6635150DE95EB&SELECT[]=UF_CRM_1715689729&start=${start}`, requestOptions)

            const result = await response.json();
            const data = result.result
            allDeals = allDeals.concat(data);

            // Si hay más resultados, 'next' tendrá un valor. Si no, será null.
            if (result.next) {
                start = result.next
            } else {
                hasMore = false;
            }

        }

        return allDeals;
    } catch (error) {
        console.log(error)
    }
}

const fetchTimemanStatus = async (userIds) => {
    const apiKey = process.env.APIKEY_BITRIX;

    try {
        // Mapea cada userID para crear una solicitud `fetch` y guarda todas las promesas en un array
        const statusPromises = userIds.map(userId => {
            const timestamp = new Date().getTime(); // Genera una marca de tiempo única para cada solicitud
            return fetch(`https://gehsuites.bitrix24.com/rest/14/${apiKey}/timeman.status?USER_ID=${userId}&timestamp=${timestamp}`)
                .then(response => response.json())
                .then(data => ({
                    userId: userId,
                    status: data.result.STATUS,
                    timeStart: data.result.TIME_START,
                    timeFinish: data.result.TIME_FINISH,
                    duration: data.result.DURATION
                }))
                .catch(error => ({
                    userId: userId,
                    error: `Error fetching status: ${error.message}`
                }));
        });

        // Ejecuta todas las solicitudes en paralelo y espera a que terminen
        const results = await Promise.all(statusPromises);

        // Muestra los resultados de cada usuario
        // console.log(results);
        return results;
    } catch (error) {
        console.error("Error al obtener el estado de asistencia:", error);
    }
};

// Función para enviar un mensaje a un usuario específico en Bitrix24
const enviarMensajeBitrix = async (userId, mensaje) => {
    const apiKey = process.env.APIKEY_BITRIX;
    const payload = {
        "USER_ID": userId, // ID del usuario que recibirá el mensaje
        "MESSAGE": mensaje
    };

    try {
        const response = await fetch(`https://gehsuites.bitrix24.com/rest/14/${apiKey}/im.message.add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        console.log(`Mensaje enviado a usuario ${userId}`);
    } catch (error) {
        console.error("Error al enviar mensaje:", error);
    }
};

const getListPasadias = async () => {
    try {
        const requestOptions = {
            method: "POST",
        };

        const response = await fetch(`${URL}/${apiKey}/crm.deal.list.json?FILTER[STAGE_ID]=C28:NEW&SELECT[]=TITLE&SELECT[]=UF_CRM_1714769540&SELECT[]=UF_CRM_1715802347&SELECT[]=UF_CRM_1718392639543&SELECT[]=CONTACT_ID`, requestOptions)

        if (response.ok) {
            const data = await response.json()
            // console.log(data)
            return data.result
        } else {
            console.log('Ocurrio un error en la peticion')
        }
    } catch (error) {
        console.log('Ocurrio un error', error)
    }
}

const crearContact = async (info) => {
    const url = `${URL}/${apiKey}/crm.contact.add.json`;

    const datos = {
        fields: {
            NAME: info.name,
            LAST_NAME: "",
            SECOND_NAME: "",
            EMAIL: [
                { VALUE: info.mail, VALUE_TYPE: "WORK" }
            ],
            PHONE: [
                { VALUE: info.celular, VALUE_TYPE: "MOBILE" }
            ],
            // ASSIGNED_BY_ID: 14,
            // COMMENTS: "Nuevo cliente potencial"
        }
    };

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            console.log("Contacto creado con éxito, ID:", resultado.result);
            return resultado.result
        } else {
            console.error("Error al crear el contacto:", resultado.error_description || resultado);
        }
    } catch (error) {
        console.error("Error de red o servidor:", error.message);
    }
}

const getListContact = async () => {

    try {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Cookie", "qmb=0.");

        const raw = JSON.stringify({
            "order": {
                "ID": "DESC"
            },
            "select": [
                "ID",
                "NAME",
                "SECOND_NAME",
                "LAST_NAME",
                "EMAIL"
            ],
            "start": 0
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        const response = await fetch(`${URL}/${apiKey}/crm.contact.list.json`, requestOptions)
        if (response.ok) {
            const data = await response.json()
            return data.result
        } else {
            console.log('Ocurrio un error en la peticion')
        }
        console.log(data)
    } catch (error) {
        console.log('Error en la consulta', error)
    }
}

const crearNegociacion = async (datos) => {
    const url = `${URL}/${apiKey}/crm.deal.add.json`;

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (respuesta.ok) {
            const resultado = await respuesta.json();
            console.log("Negociación creada con éxito, ID:", resultado.result);
            return resultado.result
        } else {
            console.error("Error al crear la negociación:", resultado.error_description || resultado);
        }
    } catch (error) {
        console.error("Error de red o servidor:", error.message);
    }
};

const updateDeal = async (data) => {

    const url = `${URL}/${apiKey}/crm.deal.update.json`;
    let datos
    if (data.status == 'completed') {
        datos = {
            id: data.id, // ID de la negociación a actualizar
            fields: {
                STAGE_ID: 'C28:WON',
                UF_CRM_1718396179138: Number(data.amount / 100),
                UF_CRM_1718396297448: data.fecha_evento,
                UF_CRM_1718397018945: data.referencia,
                UF_CRM_1719519638392: data.status,
                UF_CRM_1718394865311: "12600",
                UF_CRM_1718396464904: "12604"
            }
        };
        const deal = await getDeal(data.id)
        const contacto = await getContact(deal.CONTACT_ID)
        const datosDeal = {
            hotel: 'Hotel Sansiraka',
            fecha: deal.UF_CRM_1714769540,
            num_adultos: deal.UF_CRM_1718392639543,
            num_ninos: deal.UF_CRM_1715802347,
            mail: contacto.result.EMAIL[0].VALUE,
            celular: contacto.result.PHONE[0].VALUE
        }
        // console.log(contacto)
        await confirmacionPago(datosDeal)
        // await enviarWhatSapp()
    } else {
        datos = {
            id: data.id, // ID de la negociación a actualizar
            fields: {
                // STAGE_ID: 'LOSE',
                UF_CRM_1718396179138: Number(data.amount / 100),
                UF_CRM_1718396297448: data.fecha_evento,
                UF_CRM_1718397018945: data.referencia,
                UF_CRM_1719519638392: data.status,
                UF_CRM_1718394865311: "12600",
                UF_CRM_1718396464904: "12604"
            }
        };
    }


    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });


        const resultado = await respuesta.json();
        if (respuesta.ok) {
            console.log("Negociación actualizada con éxito.");
        } else {
            console.error("Error al actualizar la negociación:", resultado.error_description || resultado);
        }
    } catch (error) {
        console.error("Error de red o servidor:", error.message);
    }
}

const updateDealGlobal = async (datos) => {
    console.log(datos)

    const url = `${URL}/${apiKey}/crm.deal.update.json`;

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });


        const resultado = await respuesta.json();
        if (respuesta.ok) {
            console.log("Negociación actualizada con éxito.");
        } else {
            console.error("Error al actualizar la negociación:", resultado.error_description || resultado);
        }
    } catch (error) {
        console.error("Error de red o servidor:", error.message);
    }
}

module.exports = {
    getDeal,
    getContact,
    getCompany,
    getListDeal,
    fetchTimemanStatus,
    enviarMensajeBitrix,
    addDeal,
    getListPasadias,
    crearContact,
    getListContact,
    crearNegociacion,
    updateDeal,
    updateDealGlobal
}