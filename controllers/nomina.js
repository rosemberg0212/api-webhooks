const { traerTurnosAixo } = require("../middleware/turnos");

const calcularNomina = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;

    const id = req.body.event.pulseId;
    // const id = '5482696240';

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
            const datosT = datosMonday.data.boards[0].items[0].column_values;
            // console.log(datosMonday.data.boards[0].items[0].name)
            const nombre = datosMonday.data.boards[0].items[0].name

            const turnosAixo = await traerTurnosAixo()
            // console.log(turnosAixo)


            const filtro = datosT.filter(dato => {
                return dato.id !== 'estado' && dato.id !== 'tel_fono' && dato.id !== 'cargo0' && dato.id !== 'bot_n' && dato.id !== 'men__desplegable' && dato.id !== 'bot_n_1'
            })
            console.log(filtro)

            let novedad = 0
            let descuentos = 0
            let contador2 = 0;
            filtro.map(dias => {
                let codigo = dias.text
                
                if(turnosAixo.some(obj=> obj.name == codigo)){
                    contador2++
                }
            })

            filtro.map(dato => {
                if (dato.text == 'Novedad 2' || dato.text == 'Novedad 4') {
                    novedad++
                }else if(dato.text == 'Novedad 3' || dato.text == 'Novedad 5'){
                    descuentos++
                }
            })

            let diasDescontados = 0
            if(descuentos){
                diasDescontados = (contador2 - descuentos) - 1
            }else{
                diasDescontados = contador2
            }

            let domingo = 0;
            const dominicales = filtro.map(horas=>{
                if(horas.title == 'Domingo' && (horas.text == 'B1' || horas.text == 'B2' || horas.text == 'B3' || horas.text == 'B4' || horas.text == 'B5' || horas.text == 'B6' || horas.text == 'B7' || horas.text == 'B8')){
                    domingo += 8;
                }
            })
            console.log(domingo)

            await mandarNomina(diasDescontados, nombre, novedad, domingo)
            console.log(contador2)
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

const calcularNominaReservas = async (req, res)=>{
    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;

    // const id = req.body.event.pulseId;
    const id = '5567378603';

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
            const datosT = datosMonday.data.boards[0].items[0].column_values;
            // console.log(datosMonday.data.boards[0].items[0].name)
            const nombre = datosMonday.data.boards[0].items[0].name

            const turnosAixo = await traerTurnosAixo()
            // console.log(turnosAixo)


            const filtro = datosT.filter(dato => {
                return dato.id !== 'estado' && dato.id !== 'tel_fono' && dato.id !== 'cargo0' && dato.id !== 'bot_n' && dato.id !== 'men__desplegable' && dato.id !== 'bot_n_1'
            })
            // console.log(filtro)

            let novedad = 0
            let descuentos = 0
            let contador2 = 0;
            filtro.map(dias => {
                let codigo = dias.text
                
                if(turnosAixo.some(obj=> obj.name == codigo)){
                    contador2++
                }
            })

            filtro.map(dato => {
                if (dato.text == 'Novedad 2' || dato.text == 'Novedad 4') {
                    novedad++
                }else if(dato.text == 'Novedad 3' || dato.text == 'Novedad 5'){
                    descuentos++
                }
            })

            let diasDescontados = 0
            if(descuentos){
                diasDescontados = (contador2 - descuentos) - 1
            }else{
                diasDescontados = contador2
            }
            await mandarNomina(diasDescontados, nombre, novedad)
            console.log(contador2)
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

const mandarNomina = async (dias, nombre, novedades,domingo) => {

    const query = `mutation {create_item (board_id: 5567451793, group_id: \"topics\", item_name: \"${nombre}\", column_values: \"{\\\"n_meros6\\\":\\\"${dias}\\\",\\\"n_meros68\\\":\\\"${dias - novedades}\\\",\\\"n_meros06\\\":\\\"${domingo}\\\"}\") {id}}`
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

module.exports = {
    calcularNomina,
    calcularNominaReservas
}