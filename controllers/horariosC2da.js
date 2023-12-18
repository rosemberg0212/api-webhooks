const { 
    traerTurnosAixo, 
    traerTurnos1525, 
    traerTurnosRodadero, 
    traerTurnosAvexi, 
    traerTurnosAzuan, 
    traerTurnosAbi, 
    traerTurnosBocagrande,
    traerTurnosWindsor,
    traerTurnosMadisson,
    traerTurnosMarina
} = require('../middleware/turnos')
const { enviarWhatsAppBotmaker } = require('../helpers/apiBotmaker')

const enviarHorariosAixo2da = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;

    const id = '5482696148';
    // const id = req.body.event.pulseId;

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
            const telefono = data.data.boards[0].items[0].column_values[33].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const primeros15 = datosMonday.data.boards[0].items[0].column_values;
            const datosT = primeros15.slice(15, 31)
            console.log(telefono)

            const datosTurnos = await traerTurnosAixo()

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
                const novedades = datosTurnos.filter((tur) => tur.name == 'Novedad 1' || 'Novedad 2' || 'Novedad 3' || 'Novedad 2')
                if (descripcion) {
                    return `- El día *${turno.title}* su hora de entrada es a las *${descripcion.map(des => des.column_values[0].text)}*, su hora de salida es a las *${descripcion.map(des => des.column_values[1].text)}*, el hotel donde le toca laborar es *${descripcion.map(des => des.column_values[2].text)}* y sus tareas para este día son las de: *${descripcion.map(des => des.column_values[3].text)}*.`;
                } else if (novedades) {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo0' && turno.id !== 'bot_n_1') {

                    const descripcion = obtenerDescripcionTurno(turno);
                    descripciones.push(descripcion)
                }
            }

            const descripcionesConcatenadas = descripciones.join('\n');
            console.log(descripcionesConcatenadas)

            // await enviarWhatsAppBotmaker(telefono, descripcionesConcatenadas)

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
    enviarHorariosAixo2da
}