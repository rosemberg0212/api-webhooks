const novedades = () => {
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
        },
        {
            id: '5482465117',
            name: 'Novedad 5',
            column_values: [{
                id: 'hora',
                text: 'Suspension',
            },
            {
                id: 'hora2',
                text: 'Suspension',
            },
            {
                id: 'estado',
                text: 'Suspension',
            },
            { id: 'etiquetas9', text: 'Suspension' }]
        },
        {
            id: '5482465117',
            name: 'Novedad 6',
            column_values: [{
                id: 'hora',
                text: 'Permisos no remunerados',
            },
            {
                id: 'hora2',
                text: 'Permisos no remunerados',
            },
            {
                id: 'estado',
                text: 'Permisos no remunerados',
            },
            { id: 'etiquetas9', text: 'Permisos no remunerados' }]
        },
        {
            id: '5482465117',
            name: 'Novedad 7',
            column_values: [{
                id: 'hora',
                text: 'Ajustar salario',
            },
            {
                id: 'hora2',
                text: 'Ajustar salario',
            },
            {
                id: 'estado',
                text: 'Ajustar salario',
            },
            { id: 'etiquetas9', text: 'Ajustar salario' }]
        },
        {
            id: '5482465117',
            name: 'Novedad 8',
            column_values: [{
                id: 'hora',
                text: 'Liquidaciones',
            },
            {
                id: 'hora2',
                text: 'Liquidaciones',
            },
            {
                id: 'estado',
                text: 'Liquidaciones',
            },
            { id: 'etiquetas9', text: 'Liquidaciones' }]
        },
        {
            id: '5482465117',
            name: 'Novedad 9',
            column_values: [{
                id: 'hora',
                text: 'Vacaciones',
            },
            {
                id: 'hora2',
                text: 'Vacaciones',
            },
            {
                id: 'estado',
                text: 'Vacaciones',
            },
            { id: 'etiquetas9', text: 'Vacaciones' }]
        },
        {
            id: '5482465117',
            name: 'Novedad 10',
            column_values: [{
                id: 'hora',
                text: 'Licencia Maternidad',
            },
            {
                id: 'hora2',
                text: 'Licencia Maternidad',
            },
            {
                id: 'estado',
                text: 'Licencia Maternidad',
            },
            { id: 'etiquetas9', text: 'Licencia Maternidad' }]
        }
    ]

    return arrNovedades;
}

const traerTurnosAixo = async () => {

    console.log('hola rous turnosAixo')
    // const query = 'query {boards(ids: 5326768143) { groups { id title }}}'
    const query = `query { boards(ids: 5326768143) { groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } another_group: groups(ids: grupo_nuevo) {  items { id  name  column_values {  id  text  value  }  } } third_group: groups(ids: grupo_nuevo64039) {  items { id  name  column_values {  id  text  value  }  } } grupo_cuatro: groups(ids: grupo_nuevo88540) {  items { id  name  column_values {  id  text  value  }  } } grupo_sinco: groups(ids: group_title) {  items { id  name  column_values {  id  text  value  }  } } grupo_seis: groups(ids: grupo_nuevo16411) {  items { id  name  column_values {  id  text  value  }  } } grupo_siete: groups(ids: grupo_nuevo29435) {  items { id  name  column_values {  id  text  value  }  } } grupo_ocho: groups(ids: grupo_nuevo56779) {  items { id  name  column_values {  id  text  value  }  } } grupo_nueve: groups(ids: grupo_nuevo66276) {  items { id  name  column_values {  id  text  value  }  } } grupo_dies: groups(ids: grupo_nuevo43430) {  items { id  name  column_values {  id  text  value  }  } } grupo_once: groups(ids: grupo_nuevo6379) {  items { id  name  column_values {  id  text  value  }  } } grupo_doce: groups(ids: grupo_nuevo82273) {  items { id  name  column_values {  id  text  value  }  } }} } `;
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
            // console.log(JSON.stringify(data, null, 2));
            // const datosMonday = data

            const arrNovedades = novedades()

            let arreglo1 = data.data.boards[0].groups[0].items
            let arreglo2 = data.data.boards[0].another_group[0].items
            let arreglo3 = data.data.boards[0].third_group[0].items
            let arreglo4 = data.data.boards[0].grupo_cuatro[0].items
            let arreglo5 = data.data.boards[0].grupo_sinco[0].items
            let arreglo6 = data.data.boards[0].grupo_seis[0].items
            let arreglo7 = data.data.boards[0].grupo_siete[0].items
            let arreglo8 = data.data.boards[0].grupo_ocho[0].items
            let arreglo9 = data.data.boards[0].grupo_nueve[0].items
            let arreglo10 = data.data.boards[0].grupo_dies[0].items
            let arreg0l11 = data.data.boards[0].grupo_once[0].items
            let arreglo12 = data.data.boards[0].grupo_doce[0].items
            let arr = [arreglo1, arreglo2, arreglo3, arreglo4, arreglo5, arreglo6, arreglo7, arreglo8, arreglo9, arreglo10, arreg0l11, arreglo12, arrNovedades].flat()
            // console.log(arr)

            return arr;

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

const traerTurnos1525 = async () => {

    // const query = 'query {boards(ids: 5482469617) { groups { id title }}}'
    const query = `query { boards(ids: 5482469617) { groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } another_group: groups(ids: group_title) {  items { id  name  column_values {  id  text  value  }  } } third_group: groups(ids: grupo_nuevo64039) {  items { id  name  column_values {  id  text  value  }  } } grupo_cuatro: groups(ids: grupo_nuevo6379) {  items { id  name  column_values {  id  text  value  }  } } grupo_sinco: groups(ids: grupo_nuevo80712) {  items { id  name  column_values {  id  text  value  }  } } grupo_seis: groups(ids: grupo_nuevo70781) {  items { id  name  column_values {  id  text  value  }  } } } } `;
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
            // console.log(JSON.stringify(data, null, 2));
            // console.log(data.data.boards[0].groups)
            // console.log(datosMonday.data.boards[0].groups)
            const arrNovedades = novedades()

            let arreglo1 = data.data.boards[0].groups[0].items
            let arreglo2 = data.data.boards[0].another_group[0].items
            let arreglo3 = data.data.boards[0].third_group[0].items
            let arreglo4 = data.data.boards[0].grupo_cuatro[0].items
            let arreglo5 = data.data.boards[0].grupo_sinco[0].items
            let arreglo6 = data.data.boards[0].grupo_seis[0].items
            let arr = [arreglo1, arreglo2, arreglo3, arreglo4, arreglo5, arreglo6, arrNovedades].flat()
            // console.log(arr)
            console.log(arreglo2[0])
            return arr;

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
const traerTurnosRodadero = async () => {

    // const query = 'query {boards(ids: 5551668078) { groups { id title }}}'
    const query = `query { boards(ids: 5551668078) { groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } another_group: groups(ids: group_title) {  items { id  name  column_values {  id  text  value  }  } } third_group: groups(ids: grupo_nuevo64039) {  items { id  name  column_values {  id  text  value  }  } } grupo_cuatro: groups(ids: grupo_nuevo6379) {  items { id  name  column_values {  id  text  value  }  } } grupo_sinco: groups(ids: grupo_nuevo80712) {  items { id  name  column_values {  id  text  value  }  } } grupo_seis: groups(ids: grupo_nuevo) {  items { id  name  column_values {  id  text  value  }  } } } } `;
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
            // console.log(JSON.stringify(data, null, 2));
            // console.log(data.data.boards[0].groups)
            // console.log(datosMonday.data.boards[0].groups)
            const arrNovedades = novedades()

            let arreglo1 = data.data.boards[0].groups[0].items
            let arreglo2 = data.data.boards[0].another_group[0].items
            let arreglo3 = data.data.boards[0].third_group[0].items
            let arreglo4 = data.data.boards[0].grupo_cuatro[0].items
            let arreglo5 = data.data.boards[0].grupo_sinco[0].items
            let arreglo6 = data.data.boards[0].grupo_seis[0].items
            let arr = [arreglo1, arreglo2, arreglo3, arreglo4, arreglo5, arreglo6, arrNovedades].flat()
            // console.log(arr)
            // console.log(arreglo2[0])
            return arr;

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

const traerTurnosAvexi = async () => {

    // const query = 'query {boards(ids: 5628102206) { groups { id title }}}'
    const query = `query { boards(ids: 5628102206) { groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } another_group: groups(ids: group_title) {  items { id  name  column_values {  id  text  value  }  } } third_group: groups(ids: grupo_nuevo64039) {  items { id  name  column_values {  id  text  value  }  } } grupo_cuatro: groups(ids: grupo_nuevo80712) {  items { id  name  column_values {  id  text  value  }  } } grupo_sinco: groups(ids: grupo_nuevo) {  items { id  name  column_values {  id  text  value  }  } } } } `;
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
            // console.log(JSON.stringify(data, null, 2));
            console.log(data.data.boards[0].groups)
            // console.log(datosMonday.data.boards[0].groups)
            const arrNovedades = novedades()

            let arreglo1 = data.data.boards[0].groups[0].items
            let arreglo2 = data.data.boards[0].another_group[0].items
            let arreglo3 = data.data.boards[0].third_group[0].items
            let arreglo4 = data.data.boards[0].grupo_cuatro[0].items
            let arreglo5 = data.data.boards[0].grupo_sinco[0].items
            let arr = [arreglo1, arreglo2, arreglo3, arreglo4, arreglo5, arrNovedades].flat()
            // console.log(arr)
            // console.log(arreglo2[0])
            return arr;

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

const traerTurnosAzuan = async () => {

    // const query = 'query {boards(ids: 5628380713) { groups { id title }}}'
    const query = `query { boards(ids: 5628380713) { groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } another_group: groups(ids: group_title) {  items { id  name  column_values {  id  text  value  }  } } third_group: groups(ids: grupo_nuevo64039) {  items { id  name  column_values {  id  text  value  }  } } grupo_cuatro: groups(ids: grupo_nuevo80712) {  items { id  name  column_values {  id  text  value  }  } } grupo_sinco: groups(ids: grupo_nuevo) {  items { id  name  column_values {  id  text  value  }  } } grupo_seis: groups(ids: grupo_nuevo15548) {  items { id  name  column_values {  id  text  value  }  } } } } `;
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
            // console.log(JSON.stringify(data, null, 2));
            // console.log(data.data.boards[0].groups)
            // console.log(datosMonday.data.boards[0].groups)
            const arrNovedades = novedades()

            let arreglo1 = data.data.boards[0].groups[0].items
            let arreglo2 = data.data.boards[0].another_group[0].items
            let arreglo3 = data.data.boards[0].third_group[0].items
            let arreglo4 = data.data.boards[0].grupo_cuatro[0].items
            let arreglo5 = data.data.boards[0].grupo_sinco[0].items
            let arreglo6 = data.data.boards[0].grupo_seis[0].items
            let arr = [arreglo1, arreglo2, arreglo3, arreglo4, arreglo5, arreglo6, arrNovedades].flat()
            // console.log(arr)
            // console.log(arreglo2[0])
            return arr;

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

const traerTurnosAbi = async () => {

    // const query = 'query {boards(ids: 5628507752) { groups { id title }}}'
    const query = `query { boards(ids: 5628507752) { groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } another_group: groups(ids: group_title) {  items { id  name  column_values {  id  text  value  }  } } third_group: groups(ids: grupo_nuevo64039) {  items { id  name  column_values {  id  text  value  }  } } grupo_cuatro: groups(ids: grupo_nuevo80712) {  items { id  name  column_values {  id  text  value  }  } } grupo_sinco: groups(ids: grupo_nuevo) {  items { id  name  column_values {  id  text  value  }  } } } } `;
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
            // console.log(JSON.stringify(data, null, 2));
            // console.log(data.data.boards[0].groups)
            // console.log(datosMonday.data.boards[0].groups)
            const arrNovedades = novedades()

            let arreglo1 = data.data.boards[0].groups[0].items
            let arreglo2 = data.data.boards[0].another_group[0].items
            let arreglo3 = data.data.boards[0].third_group[0].items
            let arreglo4 = data.data.boards[0].grupo_cuatro[0].items
            let arreglo5 = data.data.boards[0].grupo_sinco[0].items
            let arr = [arreglo1, arreglo2, arreglo3, arreglo4, arreglo5, arrNovedades].flat()
            // console.log(arr)
            // console.log(arreglo2[0])
            return arr;

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

const traerTurnosBocagrande = async () => {

    // const query = 'query {boards(ids: 5628704392) { groups { id title }}}'
    const query = `query { boards(ids: 5628704392) { groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } another_group: groups(ids: group_title) {  items { id  name  column_values {  id  text  value  }  } } third_group: groups(ids: grupo_nuevo64039) {  items { id  name  column_values {  id  text  value  }  } } grupo_cuatro: groups(ids: grupo_nuevo80712) {  items { id  name  column_values {  id  text  value  }  } } grupo_sinco: groups(ids: grupo_nuevo) {  items { id  name  column_values {  id  text  value  }  } } } } `;
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
            // console.log(JSON.stringify(data, null, 2));
            // console.log(data.data.boards[0].groups)
            // console.log(datosMonday.data.boards[0].groups)
            const arrNovedades = novedades()

            let arreglo1 = data.data.boards[0].groups[0].items
            let arreglo2 = data.data.boards[0].another_group[0].items
            let arreglo3 = data.data.boards[0].third_group[0].items
            let arreglo4 = data.data.boards[0].grupo_cuatro[0].items
            let arreglo5 = data.data.boards[0].grupo_sinco[0].items
            let arr = [arreglo1, arreglo2, arreglo3, arreglo4, arreglo5, arrNovedades].flat()
            // console.log(arr)
            
            return arr;

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

const traerTurnosWindsor = async () => {

    // const query = 'query {boards(ids: 5628846354) { groups { id title }}}'
    const query = `query { boards(ids: 5628846354) { groups(ids: grupo_nuevo55897) {  items { id  name  column_values {  id  text  value  }  } } another_group: groups(ids: grupo_nuevo6379) {  items { id  name  column_values {  id  text  value  }  } } third_group: groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } grupo_cuatro: groups(ids: grupo_nuevo) {  items { id  name  column_values {  id  text  value  }  } } grupo_sinco: groups(ids: group_title) {  items { id  name  column_values {  id  text  value  }  } } grupo_seis: groups(ids: grupo_nuevo85030) {  items { id  name  column_values {  id  text  value  }  } } grupo_siete: groups(ids: grupo_nuevo44017) {  items { id  name  column_values {  id  text  value  }  } } grupo_ocho: groups(ids: grupo_nuevo1620) {  items { id  name  column_values {  id  text  value  }  } } grupo_nueve: groups(ids: grupo_nuevo19383) {  items { id  name  column_values {  id  text  value  }  } } grupo_dies: groups(ids: grupo_nuevo64039) {  items { id  name  column_values {  id  text  value  }  } } grupo_once: groups(ids: grupo_nuevo75846) {  items { id  name  column_values {  id  text  value  }  } } grupo_dose: groups(ids: grupo_nuevo43106) {  items { id  name  column_values {  id  text  value  }  } } grupo_trece: groups(ids: grupo_nuevo64982) {  items { id  name  column_values {  id  text  value  }  } } grupo_catorce: groups(ids: grupo_nuevo50140) {  items { id  name  column_values {  id  text  value  }  } } grupo_quince: groups(ids: grupo_nuevo53605) {  items { id  name  column_values {  id  text  value  }  } }} } `;
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
            // console.log(JSON.stringify(data, null, 2));
            // console.log(data.data.boards[0].groups)
            const arrNovedades = novedades()

            let arreglo1 = data.data.boards[0].groups[0].items
            let arreglo2 = data.data.boards[0].another_group[0].items
            let arreglo3 = data.data.boards[0].third_group[0].items
            let arreglo4 = data.data.boards[0].grupo_cuatro[0].items
            let arreglo5 = data.data.boards[0].grupo_sinco[0].items
            let arreglo6 = data.data.boards[0].grupo_seis[0].items
            let arreglo7 = data.data.boards[0].grupo_siete[0].items
            let arreglo8 = data.data.boards[0].grupo_ocho[0].items
            let arreglo9 = data.data.boards[0].grupo_nueve[0].items
            let arreglo10 = data.data.boards[0].grupo_dies[0].items
            let arreglo11 = data.data.boards[0].grupo_once[0].items
            let arreglo12 = data.data.boards[0].grupo_dose[0].items
            let arreglo13 = data.data.boards[0].grupo_trece[0].items
            let arreglo14 = data.data.boards[0].grupo_catorce[0].items
            let arreglo15 = data.data.boards[0].grupo_quince[0].items
            let arr = [arreglo1, arreglo2, arreglo3, arreglo4, arreglo5, arreglo6, arreglo7, arreglo8, arreglo9, arreglo10, arreglo11, arreglo12, arreglo13, arreglo14, arreglo15, arrNovedades].flat()
            // console.log(arr)
            
            return arr;

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

const traerTurnosMadisson = async () => {

    // const query = 'query {boards(ids: 5629036514) { groups { id title }}}'
    const query = `query { boards(ids: 5629036514) { groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } another_group: groups(ids: group_title) {  items { id  name  column_values {  id  text  value  }  } } third_group: groups(ids: grupo_nuevo64039) {  items { id  name  column_values {  id  text  value  }  } } grupo_cuatro: groups(ids: grupo_nuevo6379) {  items { id  name  column_values {  id  text  value  }  } } grupo_sinco: groups(ids: grupo_nuevo80712) {  items { id  name  column_values {  id  text  value  }  } } grupo_seis: groups(ids: grupo_nuevo) {  items { id  name  column_values {  id  text  value  }  } } grupo_siete: groups(ids: grupo_nuevo1983) {  items { id  name  column_values {  id  text  value  }  } } grupo_ocho: groups(ids: grupo_nuevo69903) {  items { id  name  column_values {  id  text  value  }  } } grupo_nueve: groups(ids: grupo_nuevo71453) {  items { id  name  column_values {  id  text  value  }  } } grupo_dies: groups(ids: grupo_nuevo59759) {  items { id  name  column_values {  id  text  value  }  } }} } `;
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
            // console.log(JSON.stringify(data, null, 2));
            // console.log(data.data.boards[0].groups)
            const arrNovedades = novedades()

            let arreglo1 = data.data.boards[0].groups[0].items
            let arreglo2 = data.data.boards[0].another_group[0].items
            let arreglo3 = data.data.boards[0].third_group[0].items
            let arreglo4 = data.data.boards[0].grupo_cuatro[0].items
            let arreglo5 = data.data.boards[0].grupo_sinco[0].items
            let arreglo6 = data.data.boards[0].grupo_seis[0].items
            let arreglo7 = data.data.boards[0].grupo_siete[0].items
            let arreglo8 = data.data.boards[0].grupo_ocho[0].items
            let arreglo9 = data.data.boards[0].grupo_nueve[0].items
            let arreglo10 = data.data.boards[0].grupo_dies[0].items
            let arr = [arreglo1, arreglo2, arreglo3, arreglo4, arreglo5, arreglo6, arreglo7, arreglo8, arreglo9, arreglo10, arrNovedades].flat()
            // console.log(arr)
            
            return arr;

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

const traerTurnosMarina = async () => {

    // const query = 'query {boards(ids: 5640398217) { groups { id title }}}'
    const query = `query { boards(ids: 5640398217) { groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } another_group: groups(ids: group_title) {  items { id  name  column_values {  id  text  value  }  } } third_group: groups(ids: grupo_nuevo64039) {  items { id  name  column_values {  id  text  value  }  } } grupo_cuatro: groups(ids: grupo_nuevo80712) {  items { id  name  column_values {  id  text  value  }  } } grupo_sinco: groups(ids: grupo_nuevo) {  items { id  name  column_values {  id  text  value  }  } } } } `;
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
            // console.log(JSON.stringify(data, null, 2));
            // console.log(data.data.boards[0].groups)
            const arrNovedades = novedades()

            let arreglo1 = data.data.boards[0].groups[0].items
            let arreglo2 = data.data.boards[0].another_group[0].items
            let arreglo3 = data.data.boards[0].third_group[0].items
            let arreglo4 = data.data.boards[0].grupo_cuatro[0].items
            let arreglo5 = data.data.boards[0].grupo_sinco[0].items
            let arr = [arreglo1, arreglo2, arreglo3, arreglo4, arreglo5, arrNovedades].flat()
            console.log(arr)
            
            return arr;

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
}