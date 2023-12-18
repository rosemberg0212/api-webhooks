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

const enviarHorarios = async (req, res) => {

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
            const datosT = primeros15.slice(0, 15)
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

const enviarHorariosReservas = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });

    const apikey = process.env.APIKEY_MONDAY;

    const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5474798239) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const telefono = data.data.boards[0].items[0].column_values[16].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const datosT = datosMonday.data.boards[0].items[0].column_values;

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
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo0'  && turno.id !== 'bot_n_1') {

                    const descripcion = obtenerDescripcionTurno(turno);
                    descripciones.push(descripcion)
                }
            }

            const descripcionesConcatenadas = descripciones.join('\n');
            console.log(descripcionesConcatenadas)

            await enviarWhatsAppBotmaker(telefono, descripcionesConcatenadas)

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

const enviarHorariosMantenimiento = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;

    // const id = '5544208564';
    const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5544208421) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const telefono = data.data.boards[0].items[0].column_values[8].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const datosT = datosMonday.data.boards[0].items[0].column_values;

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
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo7') {

                    const descripcion = obtenerDescripcionTurno(turno);
                    descripciones.push(descripcion)
                }
            }

            const descripcionesConcatenadas = descripciones.join('\n');
            console.log(descripcionesConcatenadas)

            await enviarWhatsAppBotmaker(telefono, descripcionesConcatenadas)

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

const enviarHorariosSantaM = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;
    // const datosTurnos = await traerTurnos1525()
    // console.log(datosTurnos)


    const id = '5482453565';
    // const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5482452579) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const telefono = data.data.boards[0].items[0].column_values[32].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            
            const primeros15 = datosMonday.data.boards[0].items[0].column_values;
            const datosT = primeros15.slice(0, 15)
            console.log(telefono)
            const datosTurnos = await traerTurnos1525()

            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
                const filtroDesc = descripcion.map(obj=>{
                    const columF = obj.column_values.filter(o=>o.id !== 'subelementos')

                    return {
                        id: obj.id,
                        name: obj.name,
                        column_values: columF
                    };
                })
                const novedades = datosTurnos.filter((tur) => tur.name == 'Novedad 1' || 'Novedad 2' || 'Novedad 3' || 'Novedad 4')
                if (filtroDesc) {
                    return `- El día *${turno.title}* su hora de entrada es a las *${filtroDesc.map(des => des.column_values[0].text)}*, su hora de salida es a las *${filtroDesc.map(des => des.column_values[1].text)}*, el hotel donde le toca laborar es *${filtroDesc.map(des => des.column_values[2].text)}* y sus tareas para este día son las de: *${filtroDesc.map(des => des.column_values[3].text)}*.`;
                } else if (novedades) {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo9') {

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

const enviarHorariosRodadero = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;
    // const datosTurnos = await traerTurnosRodadero()
    // console.log(datosTurnos)


    const id = '5609332573';
    // const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5551690311) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const telefono = data.data.boards[0].items[0].column_values[32].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
           
            const primeros15 = datosMonday.data.boards[0].items[0].column_values;
            const datosT = primeros15.slice(0, 15)
            console.log(telefono)
            const datosTurnos = await traerTurnosRodadero()

            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
                const filtroDesc = descripcion.map(obj=>{
                    const columF = obj.column_values.filter(o=>o.id !== 'subelementos')

                    return {
                        id: obj.id,
                        name: obj.name,
                        column_values: columF
                    };
                })
                // console.log(filtroDesc)
                // console.log(descripcion[0].column_values)
                const novedades = datosTurnos.filter((tur) => tur.name == 'Novedad 1' || 'Novedad 2' || 'Novedad 3' || 'Novedad 4')
                if (filtroDesc) {
                    return `- El día *${turno.title}* su hora de entrada es a las *${filtroDesc.map(des => des.column_values[0].text)}*, su hora de salida es a las *${filtroDesc.map(des => des.column_values[1].text)}*, el hotel donde le toca laborar es *${filtroDesc.map(des => des.column_values[2].text)}* y sus tareas para este día son las de: *${filtroDesc.map(des => des.column_values[3].text)}*.`;
                } else if (novedades) {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo9') {

                    const descripcion = obtenerDescripcionTurno(turno);
                    descripciones.push(descripcion)
                }
            }

            const descripcionesConcatenadas = descripciones.join('\n');
            console.log(descripcionesConcatenadas)
            const dia = new Date().getHours()
            console.log(dia)
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

const enviarHorariosAvexi = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;
    // const datosTurnos = await traerTurnosAvexi()
    

    const id = '5624770732';
    // const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5624770541) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const telefono = data.data.boards[0].items[0].column_values[17].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            
            const primeros15 = datosMonday.data.boards[0].items[0].column_values;
            const datosT = primeros15.slice(0, 15)
            console.log(telefono)
            const datosTurnos = await traerTurnosAvexi()

            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
                const filtroDesc = descripcion.map(obj=>{
                    const columF = obj.column_values.filter(o=>o.id !== 'subelementos')

                    return {
                        id: obj.id,
                        name: obj.name,
                        column_values: columF
                    };
                })
                // console.log(filtroDesc)
                // console.log(descripcion[0].column_values)
                const novedades = datosTurnos.filter((tur) => tur.name == 'Novedad 1' || 'Novedad 2' || 'Novedad 3' || 'Novedad 4')
                if (filtroDesc) {
                    return `- El día *${turno.title}* su hora de entrada es a las *${filtroDesc.map(des => des.column_values[0].text)}*, su hora de salida es a las *${filtroDesc.map(des => des.column_values[1].text)}*, el hotel donde le toca laborar es *${filtroDesc.map(des => des.column_values[2].text)}* y sus tareas para este día son las de: *${filtroDesc.map(des => des.column_values[3].text)}*.`;
                } else if (novedades) {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono1' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo6') {

                    const descripcion = obtenerDescripcionTurno(turno);
                    descripciones.push(descripcion)
                }
            }

            const descripcionesConcatenadas = descripciones.join('\n');
            console.log(descripcionesConcatenadas)
            
            await enviarWhatsAppBotmaker(telefono, descripcionesConcatenadas)

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

const enviarHorariosAzuan = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;
    // const datosTurnos = await traerTurnosAzuan()
    

    // const id = '5628279688';
    const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5628279640) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const telefono = data.data.boards[0].items[0].column_values[17].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const datosT = datosMonday.data.boards[0].items[0].column_values;
            console.log(telefono)
            const datosTurnos = await traerTurnosAzuan()

            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
                const filtroDesc = descripcion.map(obj=>{
                    const columF = obj.column_values.filter(o=>o.id !== 'subelementos')

                    return {
                        id: obj.id,
                        name: obj.name,
                        column_values: columF
                    };
                })
                // console.log(filtroDesc)
                // console.log(descripcion[0].column_values)
                const novedades = datosTurnos.filter((tur) => tur.name == 'Novedad 1' || 'Novedad 2' || 'Novedad 3' || 'Novedad 4')
                if (filtroDesc) {
                    return `- El día *${turno.title}* su hora de entrada es a las *${filtroDesc.map(des => des.column_values[0].text)}*, su hora de salida es a las *${filtroDesc.map(des => des.column_values[1].text)}*, el hotel donde le toca laborar es *${filtroDesc.map(des => des.column_values[2].text)}* y sus tareas para este día son las de: *${filtroDesc.map(des => des.column_values[3].text)}*.`;
                } else if (novedades) {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo2') {

                    const descripcion = obtenerDescripcionTurno(turno);
                    descripciones.push(descripcion)
                }
            }

            const descripcionesConcatenadas = descripciones.join('\n');
            console.log(descripcionesConcatenadas)
            
            await enviarWhatsAppBotmaker(telefono, descripcionesConcatenadas)

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

const enviarHorariosAbi = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;
    // const datosTurnos = await traerTurnosAbi()
    

    // const id = '5628450758';
    const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5628450734) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const telefono = data.data.boards[0].items[0].column_values[17].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const datosT = datosMonday.data.boards[0].items[0].column_values;
            console.log(telefono)
            const datosTurnos = await traerTurnosAbi()

            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
                const filtroDesc = descripcion.map(obj=>{
                    const columF = obj.column_values.filter(o=>o.id !== 'subelementos')

                    return {
                        id: obj.id,
                        name: obj.name,
                        column_values: columF
                    };
                })
                // console.log(filtroDesc)
                // console.log(descripcion[0].column_values)
                const novedades = datosTurnos.filter((tur) => tur.name == 'Novedad 1' || 'Novedad 2' || 'Novedad 3' || 'Novedad 4')
                if (filtroDesc) {
                    return `- El día *${turno.title}* su hora de entrada es a las *${filtroDesc.map(des => des.column_values[0].text)}*, su hora de salida es a las *${filtroDesc.map(des => des.column_values[1].text)}*, el hotel donde le toca laborar es *${filtroDesc.map(des => des.column_values[2].text)}* y sus tareas para este día son las de: *${filtroDesc.map(des => des.column_values[3].text)}*.`;
                } else if (novedades) {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono2' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo8') {

                    const descripcion = obtenerDescripcionTurno(turno);
                    descripciones.push(descripcion)
                }
            }

            const descripcionesConcatenadas = descripciones.join('\n');
            console.log(descripcionesConcatenadas)
            
            await enviarWhatsAppBotmaker(telefono, descripcionesConcatenadas)

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

const enviarHorariosBocagrande = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;
    // const datosTurnos = await traerTurnosBocagrande()
    

    const id = '5628654198';
    // const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5628654082) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const telefono = data.data.boards[0].items[0].column_values[17].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const datosT = datosMonday.data.boards[0].items[0].column_values;
            console.log(telefono)
            const datosTurnos = await traerTurnosBocagrande()

            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
                const filtroDesc = descripcion.map(obj=>{
                    const columF = obj.column_values.filter(o=>o.id !== 'subelementos')

                    return {
                        id: obj.id,
                        name: obj.name,
                        column_values: columF
                    };
                })
                // console.log(filtroDesc)
                // console.log(descripcion[0].column_values)
                const novedades = datosTurnos.filter((tur) => tur.name == 'Novedad 1' || 'Novedad 2' || 'Novedad 3' || 'Novedad 4')
                if (filtroDesc) {
                    return `- El día *${turno.title}* su hora de entrada es a las *${filtroDesc.map(des => des.column_values[0].text)}*, su hora de salida es a las *${filtroDesc.map(des => des.column_values[1].text)}*, el hotel donde le toca laborar es *${filtroDesc.map(des => des.column_values[2].text)}* y sus tareas para este día son las de: *${filtroDesc.map(des => des.column_values[3].text)}*.`;
                } else if (novedades) {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo8') {

                    const descripcion = obtenerDescripcionTurno(turno);
                    descripciones.push(descripcion)
                }
            }

            const descripcionesConcatenadas = descripciones.join('\n');
            console.log(descripcionesConcatenadas)
            
            await enviarWhatsAppBotmaker(telefono, descripcionesConcatenadas)

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

const enviarHorariosWindsor = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;
    // const datosTurnos = await traerTurnosWindsor()
    

    const id = '5628802926';
    // const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5628802846) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const datosT = primeros15.slice(0, 15)
            
            console.log(telefono)
            const datosTurnos = await traerTurnosWindsor()

            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
                const filtroDesc = descripcion.map(obj=>{
                    const columF = obj.column_values.filter(o=>o.id !== 'subelementos')

                    return {
                        id: obj.id,
                        name: obj.name,
                        column_values: columF
                    };
                })
                // console.log(filtroDesc)
                // console.log(descripcion[0].column_values)
                const novedades = datosTurnos.filter((tur) => tur.name == 'Novedad 1' || 'Novedad 2' || 'Novedad 3' || 'Novedad 4')
                if (filtroDesc) {
                    return `- El día *${turno.title}* su hora de entrada es a las *${filtroDesc.map(des => des.column_values[0].text)}*, su hora de salida es a las *${filtroDesc.map(des => des.column_values[1].text)}*, el hotel donde le toca laborar es *${filtroDesc.map(des => des.column_values[2].text)}* y sus tareas para este día son las de: *${filtroDesc.map(des => des.column_values[3].text)}*.`;
                } else if (novedades) {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono3' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo9') {

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

const enviarHorariosMadisson = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;
    // const datosTurnos = await traerTurnosMadisson()
    

    const id = '5628964006';
    // const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5628963944) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const datosT = primeros15.slice(0, 15)
            
            console.log(telefono)
            const datosTurnos = await traerTurnosMadisson()

            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
                const filtroDesc = descripcion.map(obj=>{
                    const columF = obj.column_values.filter(o=>o.id !== 'subelementos')

                    return {
                        id: obj.id,
                        name: obj.name,
                        column_values: columF
                    };
                })
                // console.log(filtroDesc)
                // console.log(descripcion[0].column_values)
                const novedades = datosTurnos.filter((tur) => tur.name == 'Novedad 1' || 'Novedad 2' || 'Novedad 3' || 'Novedad 4')
                if (filtroDesc) {
                    return `- El día *${turno.title}* su hora de entrada es a las *${filtroDesc.map(des => des.column_values[0].text)}*, su hora de salida es a las *${filtroDesc.map(des => des.column_values[1].text)}*, el hotel donde le toca laborar es *${filtroDesc.map(des => des.column_values[2].text)}* y sus tareas para este día son las de: *${filtroDesc.map(des => des.column_values[3].text)}*.`;
                } else if (novedades) {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo6') {

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

const enviarHorariosMarina = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;
    const datosTurnos = await traerTurnosMarina()
    

    // const id = '5640092879';
    // // const id = req.body.event.pulseId;

    // const query = `query { boards(ids: 5640092760) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
    // const response = await fetch("https://api.monday.com/v2", {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': apikey
    //     },
    //     body: JSON.stringify({
    //         'query': query
    //     })
    // });

    // try {
    //     if (response.ok) {
    //         const data = await response.json();
    //         // console.log(JSON.stringify(data, null, 2));
    //         const datosMonday = data
    //         const telefono = data.data.boards[0].items[0].column_values[17].text
    //         // console.log(datosMonday.data.boards[0].items[0].column_values)
    //         const datosT = datosMonday.data.boards[0].items[0].column_values;
    //         console.log(telefono)
    //         const datosTurnos = await traerTurnosMadisson()

    //         // console.log(datosTurnos)

    //         // Función para obtener la descripción de un turno
    //         function obtenerDescripcionTurno(turno) {
    //             const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
    //             const filtroDesc = descripcion.map(obj=>{
    //                 const columF = obj.column_values.filter(o=>o.id !== 'subelementos')

    //                 return {
    //                     id: obj.id,
    //                     name: obj.name,
    //                     column_values: columF
    //                 };
    //             })
    //             // console.log(filtroDesc)
    //             // console.log(descripcion[0].column_values)
    //             const novedades = datosTurnos.filter((tur) => tur.name == 'Novedad 1' || 'Novedad 2' || 'Novedad 3' || 'Novedad 4')
    //             if (filtroDesc) {
    //                 return `- El día *${turno.title}* su hora de entrada es a las *${filtroDesc.map(des => des.column_values[0].text)}*, su hora de salida es a las *${filtroDesc.map(des => des.column_values[1].text)}*, el hotel donde le toca laborar es *${filtroDesc.map(des => des.column_values[2].text)}* y sus tareas para este día son las de: *${filtroDesc.map(des => des.column_values[3].text)}*.`;
    //             } else if (novedades) {
    //                 return `No se encontró una descripción para el código de turno ${turno.text}.`;
    //             }
    //         }

    //         const descripciones = [];
    //         // Iterar sobre los turnos e imprimir las descripciones
    //         for (const turno of datosT) {
    //             if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo6') {

    //                 const descripcion = obtenerDescripcionTurno(turno);
    //                 descripciones.push(descripcion)
    //             }
    //         }

    //         const descripcionesConcatenadas = descripciones.join('\n');
    //         console.log(descripcionesConcatenadas)
            
    //         // await enviarWhatsAppBotmaker(telefono, descripcionesConcatenadas)

    //     } else {
    //         console.error('Hubo un error en la solicitud.');
    //         console.error('Código de estado:', response.status);
    //         const errorMessage = await response.text();
    //         console.error('Respuesta:', errorMessage);
    //     }
    // } catch (error) {
    //     console.error('Hubo un error en la solicitud:', error);
    // }
    res.status(200).end();
}

module.exports = {
    enviarHorarios,
    enviarHorariosReservas,
    enviarHorariosMantenimiento,
    enviarHorariosSantaM,
    enviarHorariosRodadero,
    enviarHorariosAvexi,
    enviarHorariosAzuan,
    enviarHorariosAbi,
    enviarHorariosBocagrande,
    enviarHorariosWindsor,
    enviarHorariosMadisson,
    enviarHorariosMarina
}