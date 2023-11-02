
const enviarCertificados = async (req, res) => {
    const challenge = req.body.challenge;
    res.send({ challenge });

    console.log(req.body);
    // console.log('hola rous')

    const id = 5443630188;

    const query = `query { boards(ids: 4279283510) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
    const response = await fetch("https://api.monday.com/v2", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI3MzE5NzY4MSwiYWFpIjoxMSwidWlkIjo0NjQ5MzM3MiwiaWFkIjoiMjAyMy0wOC0wNFQyMDo0MzoyMC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTM2OTY2OTMsInJnbiI6InVzZTEifQ._UBoJp-3wNdz5Wj_ITu-QyGG-uTrcf3nXcCrK7rugG4'
        },
        body: JSON.stringify({
            'query': query
        })
    });

    try {
        if (response.ok) {
            const data = await response.json();
            // console.log(JSON.stringify(data, null, 2));
            const datosMonday = data.data.boards[0].items[0].column_values[13].text
            const telefono = data.data.boards[0].items[0].column_values[13].text
            const certificado = data.data.boards[0].items[0].column_values[14].text
            // console.log(telefono)
            // console.log(certificado)
            console.log(datosMonday)

            const url = 'https://go.botmaker.com/api/v1.0/message/v3';
            const accessToken = 'eyJhbGciOiJIUzUxMiJ9.eyJidXNpbmVzc0lkIjoiZ2Voc3VpdGVzaG90ZWxzY29sb21iaWEiLCJuYW1lIjoiUm9zZW1iZXJnIENhcmRhbGVzIEd1ZXJyZXJvIiwiYXBpIjp0cnVlLCJpZCI6IkFmWWVaMTVhYTNVc21vNFp5UFRuTDNjSENhejEiLCJleHAiOjE4NTIyMTE4NjUsImp0aSI6IkFmWWVaMTVhYTNVc21vNFp5UFRuTDNjSENhejEifQ.KjMFzXhyjU0dLsavj5wfxdnS2H5igAkqb_yghyj0q6eUgybSinLcwasDAZS5Vb7bzKKdwlw-4KgF3C8EMeLONQ';

            const datos = {
                chatPlatform: 'whatsapp',
                chatChannelNumber: '573044564734',
                platformContactId: telefono,
                messageText: `Muy buenas estimado, hago envio del certificado: ${certificado}`,
            };

            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'access-token': accessToken,
            };

            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(datos),
            };

            try {
                const response = await fetch(url, requestOptions);
                if (response.status === 200) {
                    const responseData = await response.json();
                    console.log('Respuesta:', responseData);
                } else {
                    console.error('Error en la solicitud:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error.message);
            }

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

// Llamar a la función para obtener la información del tablero

module.exports = {
    enviarCertificados
}