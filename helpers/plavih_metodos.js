
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

module.exports = {
    crearUser
}