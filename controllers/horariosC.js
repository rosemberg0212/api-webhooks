const enviarHorarios = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });

    // console.log(req.body)
    console.log('hola rous')

    const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5327693172) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
    const response = await fetch("https://api.monday.com/v2", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3MzE5NzY4MSwiYWFpIjoxMSwidWlkIjo0NjQ5MzM3MiwiaWFkIjoiMjAyMy0wOC0wNFQyMDo0MzoyMC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTM2OTY2OTMsInJnbiI6InVzZTEifQ._UBoJp-3wNdz5Wj_ITu-QyGG-uTrcf3nXcCrK7rugG4'
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
            // const certificado = data.data.boards[0].items[0].column_values[14].text
            console.log(datosMonday.data.boards[0].items[0].column_values)
            const datosT = datosMonday.data.boards[0].items[0].column_values;
            // console.log(telefono)
            // Mapeo de códigos de turno a descripciones
            const turnosDescripcion = {
                'CT1': {
                    entrada: '7:30 am',
                    salida: '5:20 pm',
                    lugar: 'Aixo'
                }, 'Novedad 2': {
                    entrada: 'Incapacidad',
                    salida: 'Incapacidad',
                    lugar: 'Incapacidad'
                },
                'Novedad 1': {
                    entrada: '*Descanso*',
                    salida: '*Descanso*',
                    lugar: '*Descanso*'
                },
                'Novedad 3': {
                    entrada: '*Ausencia*',
                    salida: '*Ausencia*',
                    lugar: '*Ausencia*'
                },
                // Agrega más descripciones para otros códigos de turno si es necesario
            };

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = turnosDescripcion[turno.text];
                if (descripcion) {
                    return `- El día *${turno.title}* su hora de entrada es a las ${descripcion.entrada}, su hora de salida es a las ${descripcion.salida}, el hotel donde le toca laborar es ${descripcion.lugar}.`;
                } else {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n') {

                    const descripcion = obtenerDescripcionTurno(turno);
                    descripciones.push(descripcion)
                }
            }

            const descripcionesConcatenadas = descripciones.join('\n');
            console.log(descripcionesConcatenadas)

            const url = 'https://go.botmaker.com/api/v1.0/message/v3';
            const accessToken = 'eyJhbGciOiJIUzUxMiJ9.eyJidXNpbmVzc0lkIjoiZ2Voc3VpdGVzaG90ZWxzY29sb21iaWEiLCJuYW1lIjoiUm9zZW1iZXJnIENhcmRhbGVzIEd1ZXJyZXJvIiwiYXBpIjp0cnVlLCJpZCI6IkFmWWVaMTVhYTNVc21vNFp5UFRuTDNjSENhejEiLCJleHAiOjE4NTIyMTE4NjUsImp0aSI6IkFmWWVaMTVhYTNVc21vNFp5UFRuTDNjSENhejEifQ.KjMFzXhyjU0dLsavj5wfxdnS2H5igAkqb_yghyj0q6eUgybSinLcwasDAZS5Vb7bzKKdwlw-4KgF3C8EMeLONQ';

            const datos = {
                chatPlatform: 'whatsapp',
                chatChannelNumber: '573044564734',
                platformContactId: telefono,
                messageText: descripcionesConcatenadas,
            };

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access-token': accessToken,
            };

            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(datos),
            };

            try {
                const response = await fetch(url, requestOptions);
                if (response.status === 200) {
                    const responseData = await response.json();
                    console.log('Respuesta:', responseData);
                } else {
                    console.error('Error en la solicitud:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error.message);
            }

        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', response.status);
            const errorMessage = await response.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
    }
}

const enviarHorariosReservas = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });

    // console.log(req.body)
    console.log('hola rous reservas')

    const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5474798239) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
    const response = await fetch("https://api.monday.com/v2", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3MzE5NzY4MSwiYWFpIjoxMSwidWlkIjo0NjQ5MzM3MiwiaWFkIjoiMjAyMy0wOC0wNFQyMDo0MzoyMC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTM2OTY2OTMsInJnbiI6InVzZTEifQ._UBoJp-3wNdz5Wj_ITu-QyGG-uTrcf3nXcCrK7rugG4'
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
            // const certificado = data.data.boards[0].items[0].column_values[14].text
            console.log(datosMonday.data.boards[0].items[0].column_values)
            const datosT = datosMonday.data.boards[0].items[0].column_values;
            // console.log(telefono)
            // Mapeo de códigos de turno a descripciones
            const turnosDescripcion = {
                'Novedad 2': {
                    entrada: 'Incapacidad',
                    salida: 'Incapacidad',
                    lugar: 'Incapacidad'
                },
                'Novedad 1': {
                    entrada: '*Descanso*',
                    salida: '*Descanso*',
                    lugar: '*Descanso*'
                },
                'Novedad 3': {
                    entrada: '*Ausencia*',
                    salida: '*Ausencia*',
                    lugar: '*Ausencia*'
                },
                'RS1': {
                    entrada: '7:00 am',
                    salida: '3:50 pm',
                    lugar: 'Aixo'
                },
                'RS2': {
                    entrada: '8:00 am',
                    salida: '4:50 pm',
                    lugar: 'Aixo'
                },
                'RS3': {
                    entrada: '2:00 am',
                    salida: '9:50 pm',
                    lugar: 'Aixo'
                },
                'RS4': {
                    entrada: '7:00 am',
                    salida: '12:20 pm',
                    lugar: 'Aixo'
                },
                'RS5': {
                    entrada: '8:00 am',
                    salida: '1:00 pm',
                    lugar: 'Aixo'
                },
                'RS6': {
                    entrada: '10:00 am',
                    salida: '3:00 pm',
                    lugar: 'Aixo'
                },
                'RS7': {
                    entrada: '12:00 am',
                    salida: '5:00 pm',
                    lugar: 'Aixo'
                },
                'RS8': {
                    entrada: '7:30 am',
                    salida: '5:20 pm',
                    lugar: 'Aixo'
                },
                // Agrega más descripciones para otros códigos de turno si es necesario
            };

            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = turnosDescripcion[turno.text];
                if (descripcion) {
                    return `- El día *${turno.title}* su hora de entrada es a las ${descripcion.entrada}, su hora de salida es a las ${descripcion.salida}, el hotel donde le toca laborar es ${descripcion.lugar}.`;
                } else {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable') {

                    const descripcion = obtenerDescripcionTurno(turno);
                    descripciones.push(descripcion)
                }
            }

            const descripcionesConcatenadas = descripciones.join('\n');
            console.log(descripcionesConcatenadas)

            const url = 'https://go.botmaker.com/api/v1.0/message/v3';
            const accessToken = 'eyJhbGciOiJIUzUxMiJ9.eyJidXNpbmVzc0lkIjoiZ2Voc3VpdGVzaG90ZWxzY29sb21iaWEiLCJuYW1lIjoiUm9zZW1iZXJnIENhcmRhbGVzIEd1ZXJyZXJvIiwiYXBpIjp0cnVlLCJpZCI6IkFmWWVaMTVhYTNVc21vNFp5UFRuTDNjSENhejEiLCJleHAiOjE4NTIyMTE4NjUsImp0aSI6IkFmWWVaMTVhYTNVc21vNFp5UFRuTDNjSENhejEifQ.KjMFzXhyjU0dLsavj5wfxdnS2H5igAkqb_yghyj0q6eUgybSinLcwasDAZS5Vb7bzKKdwlw-4KgF3C8EMeLONQ';

            const datos = {
                chatPlatform: 'whatsapp',
                chatChannelNumber: '573044564734',
                platformContactId: telefono,
                messageText: descripcionesConcatenadas,
            };

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access-token': accessToken,
            };

            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(datos),
            };

            try {
                const response = await fetch(url, requestOptions);
                if (response.status === 200) {
                    const responseData = await response.json();
                    console.log('Respuesta:', responseData);
                } else {
                    console.error('Error en la solicitud:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error.message);
            }

        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', response.status);
            const errorMessage = await response.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
    }
}

module.exports = {
    enviarHorarios,
    enviarHorariosReservas
}