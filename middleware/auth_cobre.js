const authentication = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "user_id": process.env.USER_ID_COBRE,
            "secret": process.env.SECRET_COBRE
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        const response = await fetch("https://api.cobre.co/v1/auth", requestOptions)
        if (response.ok) {
            const token = await response.json()
            return token.access_token
        } else {
            console.log('Error en la peticion')
        }
    } catch (error) {
        console.log('Ocurrio un error', error)
    }
}

module.exports = {
    authentication
}