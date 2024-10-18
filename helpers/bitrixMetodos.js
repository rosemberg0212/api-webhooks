
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
module.exports = {
    getDeal,
    getContact
}