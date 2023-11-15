const enviarHorarios = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });

    // console.log(req.body)
    console.log('hola rous')

    const id = req.body.event.pulseId;

    const query = `query { boards(ids: 5482696120) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            // console.log(datosMonday.data.boards[0].items[0].column_values)
            const datosT = datosMonday.data.boards[0].items[0].column_values;

            const datosTurnos = await traerTurnos()
            // console.log(datosTurnos.data.boards[0])
            let arrNovedades = [
                {
                    id: '5327624916',
                    name: 'Novedad 1',
                    column_values: [{
                        id: 'hora',
                        text: 'Descanso',
                    },
                    {
                        id: 'hora2',
                        text: 'Descanso',
                    },
                    {
                        id: 'estado',
                        text: 'Descanso',
                    },
                    { id: 'etiquetas9', text: 'Descanso' }]
                },
                {
                    id: '5327624925',
                    name: 'Novedad 2',
                    column_values: [{
                        id: 'hora',
                        text: 'Incapacidad',
                    },
                    {
                        id: 'hora2',
                        text: 'Incapacidad',
                    },
                    {
                        id: 'estado',
                        text: 'Incapacidad',
                    },
                    { id: 'etiquetas9', text: 'Incapacidad' }]
                },
                {
                    id: '5327650785',
                    name: 'Novedad 3',
                    column_values: [{
                        id: 'hora',
                        text: 'Ausencia sin incapacidades',
                    },
                    {
                        id: 'hora2',
                        text: 'Ausencia sin incapacidades',
                    },
                    {
                        id: 'estado',
                        text: 'Ausencia sin incapacidades',
                    },
                    { id: 'etiquetas9', text: 'Ausencia sin incapacidades' }]
                },
                {
                    id: '5482465117',
                    name: 'Novedad 4',
                    column_values: [{
                        id: 'hora',
                        text: 'Luto',
                    },
                    {
                        id: 'hora2',
                        text: 'Luto',
                    },
                    {
                        id: 'estado',
                        text: 'Luto',
                    },
                    { id: 'etiquetas9', text: 'Luto' }]
                }
            ]

            // console.log(datosTurnos.data.boards[0].another_group[0].items)
            // let arrNovedades = datosNovedades.data.boards[0].topics[0].items
            let arreglo1 = datosTurnos.data.boards[0].groups[0].items
            let arreglo2 = datosTurnos.data.boards[0].another_group[0].items
            let arreglo3 = datosTurnos.data.boards[0].third_group[0].items
            let arreglo4 = datosTurnos.data.boards[0].grupo_cuatro[0].items
            let arreglo5 = datosTurnos.data.boards[0].grupo_sinco[0].items
            let arreglo6 = datosTurnos.data.boards[0].grupo_seis[0].items
            let arreglo7 = datosTurnos.data.boards[0].grupo_siete[0].items
            let arreglo8 = datosTurnos.data.boards[0].grupo_ocho[0].items
            let arreglo9 = datosTurnos.data.boards[0].grupo_nueve[0].items
            let arreglo10 = datosTurnos.data.boards[0].grupo_dies[0].items
            let arreg0l11 = datosTurnos.data.boards[0].grupo_once[0].items
            let arreglo12 = datosTurnos.data.boards[0].grupo_doce[0].items
            let arr = [arreglo1, arreglo2, arreglo3, arreglo4, arreglo5, arreglo6, arreglo7, arreglo8, arreglo9, arreglo10, arreg0l11, arreglo12, arrNovedades].flat()
            // console.log(arr)
            const turnos = datosTurnos.data.boards[0].groups[0].items


            // Función para obtener la descripción de un turno
            function obtenerDescripcionTurno(turno) {
                const descripcion = arr.filter((tur) => tur.name == turno.text)
                const novedades = arr.filter((tur) => tur.name == 'Novedad 1' || 'Novedad 2' || 'Novedad 3' || 'Novedad 2')
                if (descripcion) {
                    // console.log(descripcion)
                    return `- El día *${turno.title}* su hora de entrada es a las ${descripcion.map(des => des.column_values[0].text)}, su hora de salida es a las ${descripcion.map(des => des.column_values[1].text)}, el hotel donde le toca laborar es ${descripcion.map(des => des.column_values[2].text)} y sus tareas para este día son las de: ${descripcion.map(des => des.column_values[3].text)}.`;
                } else if (novedades) {
                    return `No se encontró una descripción para el código de turno ${turno.text}.`;
                }
            }

            const descripciones = [];
            // Iterar sobre los turnos e imprimir las descripciones
            for (const turno of datosT) {
                if (turno.id !== 'estado' && turno.id !== 'tel_fono' && turno.id !== 'bot_n' && turno.id !== 'men__desplegable' && turno.id !== 'cargo0') {

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
                    return `No se ha asignado aun horario para el día ${turno.text}.`;
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

const traerTurnos = async (req, res) => {

    // console.log(req.body)
    console.log('hola rous turnos')

    // const id = req.body.event.pulseId;
    // const query = 'query {boards(ids: 5326768143) { groups { id title }}}'
    const query = `query { boards(ids: 5326768143) { groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } another_group: groups(ids: grupo_nuevo) {  items { id  name  column_values {  id  text  value  }  } } third_group: groups(ids: grupo_nuevo64039) {  items { id  name  column_values {  id  text  value  }  } } grupo_cuatro: groups(ids: grupo_nuevo88540) {  items { id  name  column_values {  id  text  value  }  } } grupo_sinco: groups(ids: group_title) {  items { id  name  column_values {  id  text  value  }  } } grupo_seis: groups(ids: grupo_nuevo16411) {  items { id  name  column_values {  id  text  value  }  } } grupo_siete: groups(ids: grupo_nuevo29435) {  items { id  name  column_values {  id  text  value  }  } } grupo_ocho: groups(ids: grupo_nuevo56779) {  items { id  name  column_values {  id  text  value  }  } } grupo_nueve: groups(ids: grupo_nuevo66276) {  items { id  name  column_values {  id  text  value  }  } } grupo_dies: groups(ids: grupo_nuevo43430) {  items { id  name  column_values {  id  text  value  }  } } grupo_once: groups(ids: grupo_nuevo6379) {  items { id  name  column_values {  id  text  value  }  } } grupo_doce: groups(ids: grupo_nuevo82273) {  items { id  name  column_values {  id  text  value  }  } }} } `;
    // const query = 'query {  boards(ids: 5326768143) {   topics: groups(ids: topics) {    items {   id    name  column_values {  id  text  value   } }}  grupo_nuevo: groups(ids: grupo_nuevo) { items { id  name  column_values {  id  text  value    }  }  }'
    // const query = 'query { boards(ids: 5326768143) { groups {items {id name column_values { id text value} }} }}'
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
            // const datosMonday = data
            return data;

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