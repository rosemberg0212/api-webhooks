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

    // const datosTurnos = await traerTurnosAixo()

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;

    // const id = '5707679824';
    const id = req.body.event.pulseId;
    console.log(req.body.event.columnTitle)
    let boton = req.body.event.columnTitle;
    // let boton = 'Enviar 2ra Quincena';
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
            const telefono = data.data.boards[0].items[0].column_values[34].text
            const mail = data.data.boards[0].items[0].column_values[35].text
            const dias = datosMonday.data.boards[0].items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const datosT = dias.slice(1, 32)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                // Obtener el día de la semana del primer elemento del arreglo
                const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay();

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

            const arregloFinal = boton === 'Enviar 1ra Quincena' ? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            // Imprimir el nuevo arreglo
            // console.log(nuevoArreglo);

            console.log(telefono)
            console.log(mail)
            // console.log(datosT)
            const datosTurnos = await traerTurnosAixo()
            const novedad = await novedades()

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
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
            arrS.map(async (obj) => await apiSMS(telefono, obj))
            await probandoMail(descripcionesConcatenadas, mail)


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

    // const id = '5532254391';
    const id = req.body.event.pulseId;
    console.log(req.body.event.columnTitle)
    let boton = req.body.event.columnTitle;
    //  let boton = 'Enviar 1ra Quincena';
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
            const telefono = data.data.boards[0].items[0].column_values[32].text
            const mail = data.data.boards[0].items[0].column_values[34].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const dias = datosMonday.data.boards[0].items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const datosT = dias.slice(0, 31)
            // console.log(datosT)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                // Obtener el día de la semana del primer elemento del arreglo
                const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay();

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

            const arregloFinal = boton === 'Enviar 1ra Quincena' ? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            // Imprimir el nuevo arreglo
            // console.log(nuevoArreglo);

            console.log(telefono)
            console.log(mail)
            const datosTurnos = await traerTurnosAixo()
            const novedad = await novedades()

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
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
            arrS.map(async (obj) => await apiSMS(telefono, obj))
            await probandoMail(descripcionesConcatenadas, mail)

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


    // const id = '5482453565';
    const id = req.body.event.pulseId;
    console.log(req.body.event.columnTitle)
    let boton = req.body.event.columnTitle;
    // let boton = 'Enviar 1ra Quincena';
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
            const mail = data.data.boards[0].items[0].column_values[34].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)

            const dias = datosMonday.data.boards[0].items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const datosT = dias.slice(0, 31)
            // console.log(datosT)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                // Obtener el día de la semana del primer elemento del arreglo
                const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay();

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

            const arregloFinal = boton === 'Enviar 1ra Quincena'? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            // Imprimir el nuevo arreglo
            // console.log(nuevoArreglo);

            console.log(telefono)
            console.log(mail)
            const datosTurnos = await traerTurnos1525()
            const novedad = await novedades()
            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
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
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo9') {

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
            arrS.map(async (obj) => await apiSMS(telefono, obj))
            await probandoMail(descripcionesConcatenadas, mail)

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


    // const id = '5609332573';
    const id = req.body.event.pulseId;
    console.log(req.body.event.columnTitle)
    let boton = req.body.event.columnTitle;
    // let boton = 'Enviar 2ra Quincena';

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
            const mail = data.data.boards[0].items[0].column_values[34].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)

            const dias = datosMonday.data.boards[0].items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const datosT = dias.slice(0, 31)
            // console.log(datosT)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                // Obtener el día de la semana del primer elemento del arreglo
                const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay();

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

            const arregloFinal = boton === 'Enviar 1ra Quincena'? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            // Imprimir el nuevo arreglo
            // console.log(nuevoArreglo);
            console.log(telefono)
            console.log(mail)
            const datosTurnos = await traerTurnosRodadero()
            const novedad = await novedades()
            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
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
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo9') {

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
            arrS.map(async (obj) => await apiSMS(telefono, obj))
            await probandoMail(descripcionesConcatenadas, mail)

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


    // const id = '5624770732';
    const id = req.body.event.pulseId;
    console.log(req.body.event.columnTitle)
    let boton = req.body.event.columnTitle;
    // let boton = 'Enviar 2ra Quincena';
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
            const telefono = data.data.boards[0].items[0].column_values[33].text
            const mail = data.data.boards[0].items[0].column_values[34].text

            const dias = datosMonday.data.boards[0].items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const datosT = dias.slice(0, 31)
            // console.log(datosT)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                // Obtener el día de la semana del primer elemento del arreglo
                const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay();

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

            const arregloFinal = boton === 'Enviar 1ra Quincena'? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            // Imprimir el nuevo arreglo
            // console.log(nuevoArreglo);
            console.log(telefono)
            console.log(mail)
            const datosTurnos = await traerTurnosAvexi()
            const novedad = await novedades()

            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
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
                if (turno.id !== 'estado' && turno.id !== 'tel_fono1' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo6') {

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
            arrS.map(async (obj) => await apiSMS(telefono, obj))
            await probandoMail(descripcionesConcatenadas, mail)

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
    console.log(req.body.event.columnTitle)
    let boton = req.body.event.columnTitle;
    // let boton = 'Enviar 2ra Quincena';

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
            const telefono = data.data.boards[0].items[0].column_values[33].text
            const mail = data.data.boards[0].items[0].column_values[34].text

            const dias = datosMonday.data.boards[0].items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const datosT = dias.slice(0, 31)
            // console.log(datosT)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                // Obtener el día de la semana del primer elemento del arreglo
                const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay();

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

            const arregloFinal = boton === 'Enviar 1ra Quincena'? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            // Imprimir el nuevo arreglo
            // console.log(nuevoArreglo);
            console.log(telefono)
            console.log(mail)
            const datosTurnos = await traerTurnosAzuan()
            const novedad = await novedades()
            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
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
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo2') {

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
            arrS.map(async (obj) => await apiSMS(telefono, obj))
            await probandoMail(descripcionesConcatenadas, mail)

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
    console.log(req.body.event.columnTitle)
    let boton = req.body.event.columnTitle;
    // let boton = 'Enviar 1ra Quincena';

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
            const telefono = data.data.boards[0].items[0].column_values[33].text
            const mail = data.data.boards[0].items[0].column_values[34].text

            const dias = datosMonday.data.boards[0].items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const datosT = dias.slice(0, 31)
            // console.log(datosT)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                // Obtener el día de la semana del primer elemento del arreglo
                const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay();

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

            const arregloFinal = boton === 'Enviar 1ra Quincena'? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            // Imprimir el nuevo arreglo
            // console.log(nuevoArreglo);

            console.log(telefono)
            console.log(mail)
            const datosTurnos = await traerTurnosAbi()
            const novedad = await novedades()

            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
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
                if (turno.id !== 'estado' && turno.id !== 'tel_fono2' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo8') {

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
            arrS.map(async (obj) => await apiSMS(telefono, obj))
            await probandoMail(descripcionesConcatenadas, mail)

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

    // const id = '5628654227';
    const id = req.body.event.pulseId;
    console.log(req.body.event.columnTitle)
    let boton = req.body.event.columnTitle;
    // let boton = 'Enviar 2ra Quincena';

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
            const telefono = data.data.boards[0].items[0].column_values[33].text
            const mail = data.data.boards[0].items[0].column_values[34].text
            const dias = datosMonday.data.boards[0].items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const datosT = dias.slice(0, 31)
            // console.log(datosT)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                // Obtener el día de la semana del primer elemento del arreglo
                const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay();

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

            const arregloFinal = boton === 'Enviar 1ra Quincena'? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            // Imprimir el nuevo arreglo
            // console.log(nuevoArreglo);

            console.log(telefono)
            console.log(mail)
            const datosTurnos = await traerTurnosBocagrande()
            const novedad = await novedades()
            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
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
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo8') {

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
            arrS.map(async (obj) => await apiSMS(telefono, obj))
            await probandoMail(descripcionesConcatenadas, mail)

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


    // const id = '5628802926';
    const id = req.body.event.pulseId;
    console.log(req.body.event.columnTitle)
    let boton = req.body.event.columnTitle;
    // let boton = 'Enviar 1ra Quincena';

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
            const telefono = data.data.boards[0].items[0].column_values[34].text
            const mail = data.data.boards[0].items[0].column_values[35].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const dias = datosMonday.data.boards[0].items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const datosT = dias.slice(1, 32)
            console.log(datosT)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                // Obtener el día de la semana del primer elemento del arreglo
                const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay();

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

            const arregloFinal = boton === 'Enviar 1ra Quincena'? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            // Imprimir el nuevo arreglo
            console.log(nuevoArreglo);
            console.log(telefono)
            console.log(mail)
            const datosTurnos = await traerTurnosWindsor()
            const novedad = await novedades()
            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
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
                if (turno.id !== 'estado' && turno.id !== 'tel_fono3' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo9') {

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
            arrS.map(async (obj) => await apiSMS(telefono, obj))
            await probandoMail(descripcionesConcatenadas, mail)

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


    // const id = '5628964006';
    const id = req.body.event.pulseId;
    console.log(req.body.event.columnTitle)
    let boton = req.body.event.columnTitle;
    // let boton = 'Enviar 2ra Quincena';

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
            const mail = data.data.boards[0].items[0].column_values[34].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const dias = datosMonday.data.boards[0].items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const datosT = dias.slice(0, 31)
            // console.log(datosT)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                // Obtener el día de la semana del primer elemento del arreglo
                const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay();

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

            const arregloFinal = boton === 'Enviar 1ra Quincena'? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            // Imprimir el nuevo arreglo
            // console.log(nuevoArreglo);

            console.log(telefono)
            console.log(mail)
            const datosTurnos = await traerTurnosMadisson()
            const novedad = await novedades()
            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
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
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo6') {

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
            arrS.map(async (obj) => await apiSMS(telefono, obj))
            await probandoMail(descripcionesConcatenadas, mail)

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
    // const datosTurnos = await traerTurnosMadisson()


    // const id = '5640093020';
    const id = req.body.event.pulseId;
    console.log(req.body.event.columnTitle)
    let boton = req.body.event.columnTitle;
    // let boton = 'Enviar 2ra Quincena';

    const query = `query { boards(ids: 5640092760) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const mail = data.data.boards[0].items[0].column_values[33].text
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const dias = datosMonday.data.boards[0].items[0].column_values;
            // const datosT = boton === 'Enviar 1ra Quincena'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            const datosT = dias.slice(0, 31)
            // console.log(datosT)

            function modificarDias(arr) {
                // Obtener la fecha actual
                const fechaActual = new Date();

                // Obtener el día de la semana del primer elemento del arreglo
                const primerDiaSemana = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1).getDay();

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

            const arregloFinal = boton === 'Enviar 1ra Quincena'? nuevoArreglo.slice(0, 15) : nuevoArreglo.slice(15, 32)
            // Imprimir el nuevo arreglo
            // console.log(nuevoArreglo);

            console.log(telefono)
            console.log(mail)
            const datosTurnos = await traerTurnosMarina()
            const novedad = await novedades()
            // console.log(datosTurnos)

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = datosTurnos.filter((tur) => tur.name == turno.text)
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
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo6') {

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
            arrS.map(async (obj) => await apiSMS(telefono, obj))
            await probandoMail(descripcionesConcatenadas, mail)

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