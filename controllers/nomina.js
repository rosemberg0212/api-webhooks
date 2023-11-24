const { traerTurnosAixo } = require("../middleware/turnos");

const calcularNomina = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;

    // const id = req.body.event.pulseId;
    const id = '5482696148';

    const query = `query { boards(ids: 5482696120) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const datosMonday = data
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const datosT = datosMonday.data.boards[0].items[0].column_values;

            console.log(datosT)

            const filtro = datosT.filter(dato=>{
                return dato.id =! 'estado'
            })
            console.log(filtro)
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
    calcularNomina
}