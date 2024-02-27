const novedades = async () => {

    // const query = `query { boards(ids: 5327624833) { groups(ids: topics) {  items { id  name  column_values {  id  text  value  }  } } } } `;
    const query = `query {
        boards (ids: 5327624833) {
            items_page{
              cursor
              items {
                id
                name
                column_values {
                  id
                    text
                    value
                }
              }
            
          }
        }
      }`;
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

            let arreglo1 = data.data.boards[0].items_page.items
            // console.log(JSON.stringify(arreglo1, null, 2));
            // console.log(arreglo1)
            return arreglo1;

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

const traerTurnosAixo = async () => {

    // const query = 'query {boards(ids: 5326768143) { groups { id title }}}'
    const query = `query {
        boards (ids: 5326768143) {
            items_page{
              cursor
              items {
                id
                name
                column_values {
                  id
                    text
                    value
                }
              }
            
          }
        }
      }`;
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
            // console.log(data.data.boards[0].items_page.items)

            const arrNovedades = await novedades()


            let arreglo1 = data.data.boards[0].items_page.items
            let arr = [arreglo1, arrNovedades].flat()
            // console.log(arr)

            // return arr;

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

    const query = `query { boards (ids: 5482469617) { items_page{ cursor items { id name column_values { id text value }}}}}`;
    
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
            const arrNovedades = await novedades()

            let arreglo1 = data.data.boards[0].items_page.items
            let arr = [arreglo1, arrNovedades].flat()
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
const traerTurnosRodadero = async () => {

    const query = `query { boards (ids: 5551668078) { items_page{ cursor items { id name column_values { id text value }}}}}`;
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
            const arrNovedades = await novedades()

            let arreglo1 = data.data.boards[0].items_page.items
            let arr = [arreglo1, arrNovedades].flat()
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

const traerTurnosAvexi = async () => {

    const query = `query { boards (ids: 5628102206) { items_page{ cursor items { id name column_values { id text value }}}}}`;
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
            const arrNovedades = await novedades()

            let arreglo1 = data.data.boards[0].items_page.items
            let arr = [arreglo1, arrNovedades].flat()
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

const traerTurnosAzuan = async () => {

    const query = `query { boards (ids: 5628380713) { items_page{ cursor items { id name column_values { id text value }}}}}`;
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
            const arrNovedades = await novedades()

            let arreglo1 = data.data.boards[0].items_page.items
            let arr = [arreglo1, arrNovedades].flat()
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

const traerTurnosAbi = async () => {

    const query = `query { boards (ids: 5628507752) { items_page{ cursor items { id name column_values { id text value }}}}}`;
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
            const arrNovedades = await novedades()

            let arreglo1 = data.data.boards[0].items_page.items
            let arr = [arreglo1, arrNovedades].flat()
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

const traerTurnosBocagrande = async () => {

    const query = `query { boards (ids: 5628704392) { items_page{ cursor items { id name column_values { id text value }}}}}`;
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
            const arrNovedades = await novedades()

            let arreglo1 = data.data.boards[0].items_page.items
            let arr = [arreglo1, arrNovedades].flat()
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

    const query = `query { boards (ids: 5628846354) { items_page(limit:100){ cursor items { id name column_values { id text value }}}}}`;
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
            const arrNovedades = await novedades()

            let arreglo1 = data.data.boards[0].items_page.items
            let arr = [arreglo1, arrNovedades].flat()
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

    const query = `query { boards (ids: 5629036514) { items_page{ cursor items { id name column_values { id text value }}}}}`;
    
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
            const arrNovedades = await novedades()
            let arreglo1 = data.data.boards[0].items_page.items
            let arr = [arreglo1, arrNovedades].flat()
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

    const query = `query { boards (ids: 5640398217) { items_page{ cursor items { id name column_values { id text value }}}}}`;
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
            const arrNovedades = await novedades()

            let arreglo1 = data.data.boards[0].items_page.items
            let arr = [arreglo1, arrNovedades].flat()
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
    traerTurnosMarina,
    novedades
}