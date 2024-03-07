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

    // const query = `query { boards(ids: ${tableroId}) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const datosT = primeros15.slice(1, 16)
            // console.log(datosMonday.data.boards[0].items_page.items[0].name)
            const nombre = datosMonday.data.boards[0].items_page.items[0].name
            // console.log(datosT)
            const turnosAixo = await traerTurnosAixo()
            // console.log(turnosAixo)


            const filtro = datosT.filter(dato => {
                return dato.id !== 'estado' && dato.id !== 'tel_fono' && dato.id !== 'cargo0' && dato.id !== 'bot_n' && dato.id !== 'men__desplegable' && dato.id !== 'bot_n_1'
            })
            console.log(filtro)

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

            // filtrarNovedades.map(obj => {
            //     if (obj.text == 'RN1' && obj.title.endsWith('- S')) {
            //         domingo = 0
            //         recargosN += 3
            //         domingoN += 6
            //         domingoRecep += 3;
            //     } else if (obj.text == 'RN1' && obj.title.endsWith('- D')) {
            //         domingo += 2
            //         domingoN += 3
            //         recargosN += 6
            //     } else if (obj.text == 'RN1' && (obj.title)) {
            //         recargosN += 9
            //     } else if (obj.text == 'RD1' && obj.title.endsWith('- D')) {
            //         domingo = 0;
            //         domingoRecep += 12
            //     }else if (obj.title.endsWith('- D') && (obj.text)) {
            //         domingo += 8;
            //     } 
            // })

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
    // res.send({ challenge });

    const apikey = process.env.APIKEY_MONDAY;
    const id = req.body.event.pulseId;
    // const id = '4886261173';

    const query = `query { boards(ids: 122335008) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            // const correo = data.data.boards[0].items[0].column_values
            
            // Crear un nuevo documento PDF
            const doc = new PDFDocument();

            // Pipe el resultado a un archivo (puedes cambiar 'output.pdf' al nombre que prefieras)
            const stream = fs.createWriteStream('output.pdf');
            doc.pipe(stream);

            // Agregar contenido al PDF
            doc
                .fontSize(16)
                .text('Ejemplo de PDF con pdfkit', 100, 50);

            doc
                .fontSize(12)
                .text('¡Hola, este es un documento PDF generado con pdfkit!', 100, 80);

            // Finalizar y cerrar el documento
            doc.end();

            console.log('PDF generado con éxito');

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