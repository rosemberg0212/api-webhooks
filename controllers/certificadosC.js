const {enviarWhatsAppBotmaker} = require('../helpers/apiBotmaker')

const enviarCertificados = async (req, res) => {
    const challenge = req.body.challenge;
    res.send({ challenge });

    const apikey = process.env.APIKEY_MONDAY;
    const id = req.body.event.pulseId;
    // const id = '5443630188';

    const query = `query { boards(ids: 4279283510) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
    const response = await fetch("https://api.monday.com/v2", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apikey
        },
        body: JSON.stringify({
            'query': query
        })
    });

    try {
        if (response.ok) {
            const data = await response.json();
            // console.log(JSON.stringify(data, null, 2));
            const datosMonday = data.data.boards[0].items[0].column_values[12].text
            const telefono = data.data.boards[0].items[0].column_values[12].text
            const certificado = data.data.boards[0].items[0].column_values[14].text
            // console.log(telefono)
            // console.log(certificado)
            console.log(datosMonday)
            const cadenaTexto = `Muy buenas estimado, hago envio del certificado: ${certificado}`

            await enviarWhatsAppBotmaker(telefono, cadenaTexto)

        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', response.status);
            const errorMessage = await response.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
    }

    res.status(200).end();
}

// Llamar a la función para obtener la información del tablero

module.exports = {
    enviarCertificados
}