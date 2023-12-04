const { traerTurnosAixo, traerTurnosRodadero, traerTurnos1525 } = require("../middleware/turnos");

const calcularNomina = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;

    const id = req.body.event.pulseId;
    // const id = '5482696375';

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
            const filtrarNovedades = filtro.filter(obj => {
                return obj.text !== 'Novedad 1' && obj.text !== 'Novedad 2' && obj.text !== 'Novedad 3' && obj.text !== 'Novedad 4' && obj.text !== 'Novedad 5' && obj.text !== 'Novedad 6' && obj.text !== 'Novedad 7' && obj.text !== 'Novedad 8' && obj.text !== 'Novedad 9' && obj.text !== 'Novedad 10'
            })
            
            filtrarNovedades.map(horas=>{
                if(horas.title == 'Domingo' && (horas.text)){
                    domingo += 8;
                }
            })
            console.log(domingo)

            let recargosN = 0;
            let domingoN = 0;
            const filtrarDias = filtro.filter(obj => {
                return obj.title !== 'Domingo'
            })
            // filtrarDias.map(obj => {
            //     if(obj.text == 'RN1' && (obj.title)){
            //         recargosN += 9
            //     }
            // })

            filtrarNovedades.map(obj => {
                if(obj.text == 'RN1' && obj.title == 'Sabado'){
                    domingo = 0
                    recargosN += 3
                    domingoN += 6
                }else if(obj.text == 'RN2' && obj.title == 'Domingo'){
                    domingo = 0
                    domingoN += 3
                    recargosN += 6      
                }else if(obj.text == 'RN1' && (obj.title)){
                    recargosN += 9
                }else if(obj.text == 'RDF1' && (obj.title)){
                    domingo += 8
                }else if(obj.text == 'RNF1' && (obj.title)){
                    domingo = 0
                    domingoN += 3
                    recargosN += 6 
                }else if(obj.title == 'Viernes F' && (obj.text)){
                    domingo += 8
                }
            })
            

            await mandarNomina(diasDescontados, nombre, novedad, domingo, recargosN, domingoN)
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

    const id = req.body.event.pulseId;
    // const id = '5532254391';

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
                return dato.id !== 'estado' && dato.id !== 'tel_fono' && dato.id !== 'cargo9' && dato.id !== 'bot_n' && dato.id !== 'men__desplegable' && dato.id !== 'bot_n_1'
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

            let domingo = 0;
            const filtrarNovedades = filtro.filter(obj => {
                return obj.text !== 'Novedad 1' && obj.text !== 'Novedad 2' && obj.text !== 'Novedad 3' && obj.text !== 'Novedad 4' && obj.text !== 'Novedad 5' && obj.text !== 'Novedad 6' && obj.text !== 'Novedad 7' && obj.text !== 'Novedad 8' && obj.text !== 'Novedad 9' && obj.text !== 'Novedad 10'
            })
            
            // filtrarNovedades.map(horas=>{
            //     if(horas.title == 'Domingo' && (horas.text)){
            //         domingo += 8;
            //     }
            // })
            console.log(domingo)

            let recargosN = 0;
            let domingoN = 0;
            const filtrarDias = filtro.filter(obj => {
                return obj.title !== 'Domingo'
            })
            // filtrarDias.map(obj => {
            //     if(obj.text == 'RN1' && (obj.title)){
            //         recargosN += 9
            //     }
            // })

            filtrarNovedades.map(obj => {
                if((obj.text == 'RS4' || obj.text == 'RS5' || obj.text == 'RS6' || obj.text == 'RS7' || obj.text == 'RS8') && obj.title == 'Domingo'){
                    domingo += 5
                }else if(obj.title == 'Viernes F' && (obj.text)){
                    domingo += 5
                }
            })     

            await mandarNomina(diasDescontados, nombre, novedad, domingo, recargosN, domingoN)
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

const calcularNominaRodadero = async (req, res) => {

    const challenge = req.body.challenge;
    res.send({ challenge });
    const apikey = process.env.APIKEY_MONDAY;

    // const id = req.body.event.pulseId;
    const id = '5609332737';

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
            const datosT = datosMonday.data.boards[0].items[0].column_values;
            // console.log(datosMonday.data.boards[0].items[0].name)
            const nombre = datosMonday.data.boards[0].items[0].name

            const turnosAixo = await traerTurnosRodadero()
            // console.log(turnosAixo)


            const filtro = datosT.filter(dato => {
                return dato.id !== 'estado' && dato.id !== 'tel_fono' && dato.id !== 'cargo9' && dato.id !== 'bot_n' && dato.id !== 'men__desplegable' && dato.id !== 'bot_n_1'
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
            const filtrarNovedades = filtro.filter(obj => {
                return obj.text !== 'Novedad 1' && obj.text !== 'Novedad 2' && obj.text !== 'Novedad 3' && obj.text !== 'Novedad 4' && obj.text !== 'Novedad 5' && obj.text !== 'Novedad 6' && obj.text !== 'Novedad 7' && obj.text !== 'Novedad 8' && obj.text !== 'Novedad 9' && obj.text !== 'Novedad 10'
            })
            
            filtrarNovedades.map(horas=>{
                if((horas.title == 'Domingo 3' || horas.title == 'Domingo 10') && (horas.text)){
                    domingo += 8;
                }
            })
            console.log(domingo)

            let recargosN = 0;
            let domingoN = 0;
            const filtrarDias = filtro.filter(obj => {
                return obj.title !== 'Domingo'
            })
            // filtrarDias.map(obj => {
            //     if(obj.text == 'RN1' && (obj.title)){
            //         recargosN += 9
            //     }
            // })

            filtrarNovedades.map(obj => {
                if((obj.text == 'RR2' || obj.text == 'RC2') && (obj.title == 'Sabado 2' || obj.title == 'Sabado 9')){
                    domingo = 0
                    recargosN += 3
                    domingoN += 6
                }else if((obj.text == 'RR2' || obj.text == 'RC2')  && (obj.title == 'Domingo 3' || obj.title == 'Domingo 10')){
                    domingo = 0
                    domingoN += 3
                    recargosN += 6      
                }else if(obj.title == 'Viernes 8' && (obj.text == 'RR1' || obj.text == 'RC1')){
                    domingo += 8
                }else if(obj.title == 'Viernes 8' && (obj.text == 'RR2' || obj.text == 'RC2')){
                    domingo = 0
                    domingoN += 3
                    recargosN += 6 
                }else if((obj.text == 'RR2' || obj.text == 'RC2') && (obj.title)){
                    recargosN += 9
                }
            })
            

            await mandarNomina(diasDescontados, nombre, novedad, domingo, recargosN, domingoN)
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

const mandarNomina = async (dias, nombre, novedades,domingo, recargosN, domingoN) => {

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

module.exports = {
    calcularNomina,
    calcularNominaReservas,
    calcularNominaRodadero
}