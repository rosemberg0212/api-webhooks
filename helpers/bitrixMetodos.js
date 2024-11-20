
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
            UF_CRM_1731705380746: url

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
        // console.log(`Mensaje enviado a usuario ${userId}:`, result);
    } catch (error) {
        console.error("Error al enviar mensaje:", error);
    }
};



module.exports = {
    getDeal,
    getContact,
    getListDeal,
    fetchTimemanStatus,
    enviarMensajeBitrix,
    addDeal
}