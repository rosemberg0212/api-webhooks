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

const authenticationMultiples = async (empresa) => {
    console.log(empresa)
    let user_id
    let secret
    if (empresa == 'econo') {
        user_id = process.env.USER_ID_COBRE_ECONO
        secret = process.env.SECRET_COBRE_ECONO
    } else if (empresa == 'sociedad') {
        user_id = process.env.USER_ID_COBRE_SOCIEDAD
        secret = process.env.SECRET_COBRE_SOCIEDAD
    } else if (empresa == 'caribe') {
        user_id = process.env.USER_ID_COBRE_CARIBE
        secret = process.env.SECRET_COBRE_CARIBE
    } else if (empresa == 'dt') {
        user_id = process.env.USER_ID_COBRE_DT
        secret = process.env.SECRET_COBRE_DT
    } else if (empresa == 'smart') {
        user_id = process.env.USER_ID_COBRE_SMART
        secret = process.env.SECRET_COBRE_SMART
    }
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "user_id": user_id,
            "secret": secret
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
    authentication,
    authenticationMultiples
}