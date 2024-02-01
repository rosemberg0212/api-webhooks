const { enviarWhatsTemplate } = require('../helpers/apiBotmaker')
const { probandoMail, invitacionWindor } = require('../helpers/apiMail')
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const qr = require('qrcode');

const felizCumple = async (req, res) => {
    const challenge = req.body.challenge;
    res.send({ challenge });

    const apikey = process.env.APIKEY_MONDAY;
    const id = req.body.event.pulseId;
    // const id = '4886261173';

    const query = `query { boards(ids: 3426311372) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const telefono = data.data.boards[0].items[0].column_values[23].text
            const name = data.data.boards[0].items[0].name
            console.log(telefono)
            // console.log(name)
            const params = { name: name }
            await enviarWhatsTemplate(telefono, '573044564734', 'felicitaciones', params)

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

const InvitacionesAnato = async (req, res) => {
    //     const challenge = req.body.challenge;
    //     res.send({ challenge });

    //     const apikey = process.env.APIKEY_MONDAY;
    //     const id = req.body.event.pulseId;
    //     // const id = '5964129481';

    //     const query = `query { boards(ids: 5894171160) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
    //     const response = await fetch("https://api.monday.com/v2", {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': apikey
    //         },
    //         body: JSON.stringify({
    //             'query': query
    //         })
    //     });

    //     try {
    //         if (response.ok) {
    //             const data = await response.json();
    //             // console.log(JSON.stringify(data, null, 2));
    //             const correo = data.data.boards[0].items[0].column_values[7].text
    //             const nombre = data.data.boards[0].items[0].column_values[1].text
    //             console.log(nombre)
    //             console.log(correo)
    //             if (correo.trim() === '') {
    //                 console.log('correo vacio')
    //                 return
    //             }

    //             let cadena =
    // `¡Celebremos juntos la Gran Reapertura del Hotel Windsor House durante el marco de la Feria ANATO 2024!
    // Estimado ${nombre}
    // En Geh Suites, nos complace enormemente anunciar la gran reapertura del emblemático Hotel Windsor House en Bogotá. Como parte de nuestra familia, queremos compartir contigo este emocionante momento en el que inauguramos una nueva etapa de elegancia y comodidad.
    // La fecha está marcada: 29/01/2024 a partir de las 06:30 pm. Nos encantaría contar con tu grata presencia para celebrar este hito tan significativo. La Gran Reapertura se llevará a cabo en el marco de la prestigiosa Feria ANATO 2024, convirtiéndose en el escenario perfecto para disfrutar de un ambiente lleno de exclusividad y experiencias inolvidables.
    // Para confirmar tu asistencia y asegurar tu lugar en esta memorable celebración, te invitamos a responder a este correo ingresando al siguiente link y diligenciando el cuestionario.
    // https://wkf.ms/4839yQF
    // Agradecemos tu continuo apoyo y confianza en Geh Suites Hotels. Estamos emocionados de compartir este momento contigo y esperamos que te unas a nosotros para vivir la experiencia única de la Gran Reapertura del Hotel Windsor House.

    // Con cordiales saludos,
    // Geh Suites Hotels.`

    //             let asunto = 'Invitacion Reapertura Windsor'
    //             // let nombreAgencia = 'El Rossss'
    //             const pdfBuffer = fs.readFileSync('public/Reapertura_Windsor.pdf');
    //             const pdfDoc = await PDFDocument.load(pdfBuffer);

    //             const page = pdfDoc.getPages()[0]; // Obtén la primera página (puedes ajustarlo según tu PDF)
    //             const { width, height } = page.getSize();

    //             // Agrega el nombre de la agencia en una posición específica
    //             const fontSize = 12;
    //             const x = 250;
    //             const y = height - 390;
    //             page.drawText(nombre, { x, y, fontSize });

    //             const pdfBytes = await pdfDoc.save();
    //             fs.writeFileSync('public/modificado.pdf', pdfBytes);

    //             await invitacionWindor(cadena, correo, asunto)


    //         } else {
    //             console.error('Hubo un error en la solicitud.');
    //             console.error('Código de estado:', response.status);
    //             const errorMessage = await response.text();
    //             console.error('Respuesta:', errorMessage);
    //         }
    //     } catch (error) {
    //         console.error('Hubo un error en la solicitud:', error);
    //     }

    await generarQR()

    res.status(200).end();
}

const generarQR = async () => {
    const apikey = process.env.APIKEY_MONDAY;
    // const id = req.body.event.pulseId;
    const id = '5968736518';

    const query = `query { boards(ids: 5968533711) { id items (ids: ${id}) { id name column_values { id title text } } } }`;
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
            const contacto = data.data.boards[0].items[0].column_values[0].text
            const nuemroP = data.data.boards[0].items[0].column_values[4].text
            const pais = data.data.boards[0].items[0].column_values[3].text
            const agencia = data.data.boards[0].items[0].name
            console.log(contacto)
            console.log(agencia)
            console.log(nuemroP)
            console.log(pais)

            const datosPersona = `Nombre: ${contacto}, Agencia: ${agencia}, Pais: ${pais}, Numero de acompañantes: ${nuemroP}
    `;
            try {
                const codigoQR = await qr.toFile('public/codigo_qr.png', JSON.stringify(datosPersona));
                console.log('Código QR generado y guardado con éxito en public/codigo_qr.png');
            } catch (error) {
                console.error('Error al generar y guardar el código QR:', error);
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
   

}

module.exports = {
    felizCumple,
    InvitacionesAnato
}