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
    traerTurnosMarina,
    novedades
} = require('../middleware/turnos')
const { apiSMS, probandoMail, enviarWhatsAppBotmaker, enviarWhatsTemplate } = require('../helpers')

const enviarHorarios = async (req, res) => {

    // const datosTurnos = await traerTurnosMarina()

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;

    // const id = '5759040230';
    const id = req.body.event.pulseId;
    // console.log(req.body.event)
    let grupo = req.body.event.groupId;
    console.log(req.body.event.groupId)
    let boton = req.body.event.columnTitle;
    let tableroId = req.body.event.boardId;
    // let boton = 'Enviar 1ra Quincena';
    const query = `query  { boards  (ids: ${tableroId}) { items_page (query_params: {ids: ${id}}) { items { id name column_values { id  text column {title} ...on BoardRelationValue{display_value} ...on MirrorValue {display_value} }}}}}`;

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
            // console.log( data.data.boards[0].items_page.items[0].column_values)
            const datosMonday = data
            const telefono = data.data.boards[0].items_page.items[0].column_values[34].text
            const mail = data.data.boards[0].items_page.items[0].column_values[35].text
            const dias = datosMonday.data.boards[0].items_page.items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const diasFiltrado = dias.filter(obj => obj.id !== 'subitems' && obj.id !== 'subelementos')

            const datosT = diasFiltrado.slice(0, 33)
            const mesActual = new Date().getMonth();
            console.log(mesActual)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                let primerDiaSemana 
                if ((grupo == 'duplicate_of_mayo_1_al_31__202__1' || grupo == 'duplicate_of_mayo_1_al_31___20__1') && mesActual == 4) { 
                    primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay()
                } else if ((grupo == 'duplicate_of_mayo_1_al_31__202__1' || grupo == 'duplicate_of_abril_1_al_30___2__1') && mesActual == 5) {
                    primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay()
                } else {
                    primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay()
                }

                // Obtener el día de la semana del primer elemento del arreglo
                // const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay();

                // Crear un arreglo con los nombres de los días de la semana
                const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

                // Iterar sobre el arreglo de objetos y modificar la propiedad "title"
                const nuevoArr = arr.map((obj, index) => {
                    const nuevoDiaIndex = (primerDiaSemana + index) % 7;
                    const nuevoTitulo = `${diasSemana[nuevoDiaIndex]} ${index + 1}`;
                    return { ...obj, title: nuevoTitulo };
                });

                return nuevoArr;
            }


            // Llamar a la función y obtener el nuevo arreglo modificado
            const nuevoArreglo = modificarDias(datosT);

            let arregloFinal
            if (grupo === 'duplicate_of_mayo_1_al_31__202__1' || grupo === 'duplicate_of_mayo_1_al_31___20__1' || grupo == 'duplicate_of_marzo_1_al_31___2') {
                arregloFinal = boton === 'Enviar 1ra Quincena' ? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 30)
            } else {
                arregloFinal = boton === 'Enviar 1ra Quincena' ? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            }

            // Imprimir el nuevo arreglo
            // console.log(nuevoArreglo);
            console.log(telefono)
            console.log(mail)
            // console.log(datosT)
            let datosTurnos 

            switch (tableroId) {
                case 5482696120:
                    datosTurnos = await traerTurnosAixo()
                    break;

                case 5474798239:
                    datosTurnos = await traerTurnosAixo()
                    break;

                case 5482452579:
                    datosTurnos = await traerTurnos1525()
                    break;

                case 5551690311:
                    datosTurnos = await traerTurnosRodadero()
                    break;

                case 5624770541:
                    datosTurnos = await traerTurnosAvexi()
                    break;

                case 5628279640:
                    datosTurnos = await traerTurnosAzuan()
                    break;

                case 5628450734:
                    datosTurnos = await traerTurnosAbi()
                    break;

                case 5628654082:
                    datosTurnos = await traerTurnosBocagrande()
                    break;

                case 5628802846:
                    datosTurnos = await traerTurnosWindsor()
                    break;

                case 5628963944:
                    datosTurnos = await traerTurnosMadisson()
                    break;

                case 5640092760:
                    datosTurnos = await traerTurnosMarina()
                    break;

                case 5736878550:
                    datosTurnos = await traerTurnosAixo()
                    break;

                default:
                    break;
            }
            const novedad = await novedades()

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.display_value)
                const filtroDesc = descripcion.map(obj => {
                    const columF = obj.column_values.filter(o => o.id !== 'subelementos')

                    return {
                        id: obj.id,
                        name: obj.name,
                        column_values: columF
                    };
                })

                const conca = filtroDesc.length === 0
                    ? [`- No hay horario asignado para el día ${turno.title}.`]
                    : filtroDesc.map(obj => {
                        if (novedad.some(nov => nov.name === obj.name)) {
                            return `- El día ${turno.title} ${obj.column_values[0].text}.`;
                        } else {
                            return `- El día ${turno.title} su hora de entrada es a las ${obj.column_values[0].text}, su hora de salida es a las ${obj.column_values[1].text}, el hotel donde le toca laborar es ${obj.column_values[2].text} y sus tareas para este día son las de: ${obj.column_values[3].text}.`;
                        }
                    });

                return conca;
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of arregloFinal) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo0' && turno.id !== 'bot_n_1') {

                    const descripcion = obtenerDescripcionTurno(turno);
                    descripciones.push(descripcion)
                }
            }

            const descripcionesConcatenadas = descripciones.join('\n');
            // console.log(descripcionesConcatenadas)

            const mitadLongitud = Math.floor(descripcionesConcatenadas.length / 2);

            // Busca el último salto de línea en la primera mitad de la cadena
            const ultimoSaltoLinea = descripcionesConcatenadas.lastIndexOf('\n', mitadLongitud);

            // Si se encuentra un salto de línea en la primera mitad, divide la cadena en consecuencia
            let primeraMitad, segundaMitad;
            if (ultimoSaltoLinea !== -1) {
                primeraMitad = descripcionesConcatenadas.slice(0, ultimoSaltoLinea);
                segundaMitad = descripcionesConcatenadas.slice(ultimoSaltoLinea + 1);
            } else {
                // Si no se encuentra un salto de línea, simplemente divide la cadena por la mitad
                primeraMitad = descripcionesConcatenadas.slice(0, mitadLongitud);
                segundaMitad = descripcionesConcatenadas.slice(mitadLongitud);
            }

            const arrS = [primeraMitad, segundaMitad]

            // Imprime o utiliza las mitades según sea necesario

            console.log(primeraMitad);
            console.log(segundaMitad);
            let asunto = 'Notificacion Horario Laboral'
            // arrS.map(async (obj) => await apiSMS(telefono, obj))
            // await probandoMail(descripcionesConcatenadas, mail, asunto) 


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
    enviarHorarios,
}