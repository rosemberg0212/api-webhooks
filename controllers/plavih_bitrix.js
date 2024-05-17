const {crearUser} = require('../helpers/plavih_metodos')

const obtenerDatosUsuario = async (req, res) => {

    // const myHeaders = new Headers();
    // myHeaders.append("Cookie", "qmb=0.");
    const {id} = req.params
    const api_key = process.env.APIKEY_BITRIX; 

    const requestOptions = {
        method: "POST",
        // headers: myHeaders,
        redirect: "follow"
    };

    try {
        const prospecto = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.lead.get.json?ID=${id}`, requestOptions);
        const result = await prospecto.json();
        const data = result.result
        // console.log(data);

        const cc = data.UF_CRM_1714481829
        const cc_sin_puntos = cc.replace(/\./g, "");
        const contact_id = data.CONTACT_ID
        // console.log('====////=====////======/////=====//////=====//////')
        const contacto = await fetch(`https://gehsuites.bitrix24.com/rest/14/${api_key}/crm.contact.get.json?ID=${contact_id}`, requestOptions);
        const resultContact = await contacto.json()
        // console.log(resultContact)

        const nombre = resultContact.result.NAME
        const apellido = resultContact.result.LAST_NAME
        const email = resultContact.result.EMAIL[0].VALUE

        crearUser(cc_sin_puntos, nombre, apellido, email)

    } catch (error) {
        console.error(error);
    }

    res.status(200).end();
}

module.exports = {
    obtenerDatosUsuario
}