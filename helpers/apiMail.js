const nodemailer = require("nodemailer");
const fs = require('fs');

const probandoMail = async (cuerpo, mail, asunto) => {

    const config = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "gestionhumana@gehsuites.com",
            pass: process.env.MAIL_CONTRA_APP,
        },
    };

    const mensaje = {
        from: "gestionhumana@gehsuites.com",
        to: `${mail}`,
        subject: `${asunto}`,
        text: `${cuerpo}`,
    };
    const transport = nodemailer.createTransport(config);
    const info = await transport.sendMail(mensaje);
    console.log(info)
};

const invitacionWindor = async (cuerpo, mail, asunto) => {
    const config = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "reservas@gehsuites.com",
            pass: process.env.MAIL_CONTRA_APP_RESERVAS,
        },
    };

    const mensaje = {
        from: "reservas@gehsuites.com",
        to: `${mail}`,
        subject: `${asunto}`,
        text: `${cuerpo}`,
        attachments: [
            {
                filename: 'Reapertura_Windsor.pdf',
                path: 'public/modificado.pdf', // Ruta al archivo PDF que deseas adjuntar
                encoding: 'base64', // Puedes cambiar el método de codificación según tus necesidades
            },
        ],
    };
    const transport = nodemailer.createTransport(config);
    const info = await transport.sendMail(mensaje);
    console.log(info)
}

module.exports = {
    probandoMail,
    invitacionWindor
}