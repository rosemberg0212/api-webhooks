const { traerTurnosAixo, traerTurnosRodadero, traerTurnos1525 } = require("../middleware/turnos");
const fs = require('fs');
const PDFDocument = require('pdfkit');

const calcularNomina = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;

    const id = req.body.event.pulseId;
    // const id = '5482696375';
    let tableroId = req.body.event.boardId
    console.log(req.body.event.columnTitle)
    let btn = req.body.event.columnTitle

    const query = `query  { boards  (ids: ${tableroId}) { items_page (query_params: {ids: ${id}}) { items { id name column_values { id  text column {title} ...on BoardRelationValue{display_value} ...on MirrorValue {display_value} }}}}}`
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
            const primeros15 = datosMonday.data.boards[0].items_page.items[0].column_values;

            const datosT = btn === 'Calcular nomina 1ra 15na'? primeros15.slice(1, 16) : primeros15.slice(16, 32)
            // const datosT = primeros15.slice(1, 16)
            // console.log(datosMonday.data.boards[0].items_page.items[0].name)
            const nombre = datosMonday.data.boards[0].items_page.items[0].name
            console.log(datosT)
            const turnosAixo = await traerTurnosAixo() 
            // console.log(turnosAixo)


            const filtro = datosT.filter(dato => {
                return dato.id !== 'estado' && dato.id !== 'tel_fono' && dato.id !== 'cargo0' && dato.id !== 'bot_n' && dato.id !== 'men__desplegable' && dato.id !== 'bot_n_1'
            })
            // console.log(filtro)

            let novedad = 0
            let descuentos = 0
            let contador2 = 0;
            let descontarUnDia = 0;
            filtro.map(dias => {
                let codigo = dias.display_value

                if (turnosAixo.some(obj => obj.name == codigo)) {
                    contador2++
                }
            })

            filtro.map(dato => {
                if (dato.display_value == 'Novedad 2' || dato.display_value == 'Novedad 4' || dato.display_value == 'Novedad 10') {
                    novedad++
                } else if (dato.display_value == 'Novedad 12' || dato.display_value == 'Novedad 5') {
                    descuentos++
                } else if (dato.display_value == 'Novedad 3') {
                    descontarUnDia++
                }
            })

            let diasDescontados = 0
            if (descuentos) {
                diasDescontados = (contador2 - descuentos) - 1
            } else if (descontarUnDia) {
                diasDescontados = (contador2 - descontarUnDia)
            } else {
                diasDescontados = contador2
            }

            let domingo = 0;
            const filtrarNovedades = filtro.filter(obj => {
                return obj.display_value !== 'Novedad 1' && obj.display_value !== 'Novedad 2' && obj.display_value !== 'Novedad 3' && obj.display_value !== 'Novedad 4' && obj.display_value !== 'Novedad 5' && obj.display_value !== 'Novedad 6' && obj.display_value !== 'Novedad 7' && obj.display_value !== 'Novedad 8' && obj.display_value !== 'Novedad 9' && obj.display_value !== 'Novedad 10' && obj.display_value !== 'Novedad 11'
            })


            filtrarNovedades.map(obj => {
                if (obj.column.title.endsWith('- D') && (obj.display_value)) {
                    domingo += 8;
                }
            })
            console.log(`es domingo ${domingo}`)

            let recargosN = 0;
            let domingoN = 0;
            let domingoRecep = 0;

            let sumaDomingos = domingo + domingoRecep
            await mandarNomina(diasDescontados, nombre, novedad, sumaDomingos, recargosN, domingoN)
            // console.log(contador2)
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

const mandarNomina = async (dias, nombre, novedades, domingo, recargosN, domingoN) => {

    const query = `mutation {create_item (board_id: 5567451793, group_id: \"topics\", item_name: \"${nombre}\", column_values: \"{\\\"n_meros6\\\":\\\"${dias}\\\",\\\"n_meros68\\\":\\\"${dias - novedades}\\\",\\\"n_meros60\\\":\\\"${recargosN}\\\",\\\"n_meros06\\\":\\\"${domingo}\\\", \\\"n_meros56\\\":\\\"${domingoN}\\\"}\") {id}}`
    const response = await fetch("https://api.monday.com/v2", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.APIKEY_MONDAY
        },
        body: JSON.stringify({
            'query': query
        })
    });

    try {
        if (response.ok) {
            const data = await response.json();
            console.log(JSON.stringify(data))
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

const generarTirilla = async (req, res) => {
    const challenge = req.body.challenge;
    res.send({ challenge });

    const apikey = process.env.APIKEY_MONDAY;
    const id = req.body.event.pulseId;
    let tableroId = req.body.event.boardId
    // const id = '4886261173';

    const query = `query  { boards  (ids: ${tableroId}) { items_page (query_params: {ids: ${id}}) { items { id name column_values { id  text column {title} ...on BoardRelationValue{display_value} ...on MirrorValue {display_value} ...on FormulaValue{value id}}}}}}`
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
            console.log(JSON.stringify(data, null, 2)); 
            // const correo = data.data.boards[0].items[0].column_values

        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', response.status);
            const errorMessage = await response.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
    }

    // res.status(200).end();
}

module.exports = {
    calcularNomina,
    generarTirilla
}