
const obtenerUsuarioMonday = async (req, res) => {
    const challenge = req.body.challenge;
    res.send({ challenge });

    const apikey = process.env.APIKEY_MONDAY;
    // const id = '6421003842'
    const id = req.body.event.pulseId;
    let tableroId = req.body.event.boardId
    // let tableroId = '6363253775'
    let btn = req.body.event.columnTitle;

    const query = `query  { boards  (ids: ${tableroId}) { items_page (query_params: {ids: ${id}}) { items { id name column_values { id value text }}}}}`;
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
            const datos = data.data.boards[0].items_page.items[0].column_values
            const nombreCompleto = data.data.boards[0].items_page.items[0].name

            const cc = datos.find((data) => data.id == 'texto9')

            const cc_sin_puntos = (cc.text).replace(/\./g, "");

            const email = datos.find((data) => data.id == 'correo_electr_nico')

            const dividirNombreCompleto = (nombreCompleto) => {

                // Dividir el nombre completo en palabras
                const palabras = nombreCompleto.split(" ");

                // Determinar la cantidad de palabras en el nombre
                const numPalabras = palabras.length;

                let nombres, apellidos;

                if (numPalabras === 1) {
                    // Si solo hay una palabra, asumimos que es el primer nombre
                    nombres = palabras[0];
                    apellidos = "";
                } else if (numPalabras === 2) {
                    // Si hay dos palabras, la primera es el primer nombre y la segunda es el primer apellido
                    nombres = palabras[0];
                    apellidos = palabras[1];
                } else if (numPalabras === 3) {
                    // Si hay tres palabras, la primera es el primer nombre y las dos últimas son los apellidos
                    nombres = palabras[0];
                    apellidos = palabras.slice(-2).join(" ");
                } else {
                    // Si hay cuatro o más palabras, las dos primeras son los nombres y las dos últimas son los apellidos
                    nombres = palabras.slice(0, 2).join(" ");
                    apellidos = palabras.slice(-2).join(" ");
                }

                return {
                    nombres: nombres,
                    apellidos: apellidos
                };
            }

            console.log(dividirNombreCompleto(nombreCompleto))
            const nombre = dividirNombreCompleto(nombreCompleto)
            const apellido = dividirNombreCompleto(nombreCompleto)
            btn == 'Crear'? crearUser(cc_sin_puntos, nombre.nombres, apellido.apellidos, email.text) : getUser(cc_sin_puntos)

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

const getUser = async (id) => {
    const usurPlavih = await fetch(`http://143.198.118.131:8081/api/usuarios/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    try {
        if (usurPlavih.ok) {

            const dataPlavih = await usurPlavih.json();
            console.log(dataPlavih.result.users[0])
            const userId = dataPlavih.result.users[0].id;

            deleteUser(userId)
        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', usurPlavih.status);
            const errorMessage = await usurPlavih.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
    }
}

const crearUser = async (username, firstname, lastname, email) => {

    const usurPlavih = await fetch(`http://143.198.118.131:8081/api/usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username, firstname, lastname, email
        })
    });

    try {
        if (usurPlavih.ok) {

            const dataPlavih = await usurPlavih.json();
            console.log(dataPlavih.result)
        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', usurPlavih.status);
            const errorMessage = await usurPlavih.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
    }
}

const deleteUser = async (id) => {

    const usurPlavih = await fetch(`http://143.198.118.131:8081/api/usuarios/delete/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    try {
        if (usurPlavih.ok) {

            const dataPlavih = await usurPlavih.json();
            console.log(dataPlavih.result)
        } else {
            console.error('Hubo un error en la solicitud.');
            console.error('Código de estado:', usurPlavih.status);
            const errorMessage = await usurPlavih.text();
            console.error('Respuesta:', errorMessage);
        }
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
    }
}

module.exports = {
    obtenerUsuarioMonday
}