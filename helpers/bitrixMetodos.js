
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
        console.log(results);
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
        console.log(`Mensaje enviado a usuario ${userId}:`, result);
    } catch (error) {
        console.error("Error al enviar mensaje:", error);
    }
};


module.exports = {
    getDeal,
    getContact,
    getListDeal,
    fetchTimemanStatus,
    enviarMensajeBitrix
}