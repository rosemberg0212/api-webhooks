const {enviarWhatsTemplate} = require('../helpers/apiBotmaker')

const felizCumple = async (req, res) => {
    const challenge = req.body.challenge;
    res.send({ challenge });

    const apikey = process.env.APIKEY_MONDAY;
    const id = req.body.event.pulseId;
    // const id = '4886261173';

    const query = `query { boards(ids: 3426311372) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const telefono = data.data.boards[0].items[0].column_values[23].text
            const name = data.data.boards[0].items[0].name
            console.log(telefono) 
            // console.log(name)
            const params = {name: name}
            await enviarWhatsTemplate(telefono, '573044564734', 'felicitaciones', params)

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

module.exports = {
    felizCumple
}