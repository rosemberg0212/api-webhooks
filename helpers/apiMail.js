const nodemailer = require("nodemailer");

const probandoMail = async (cuerpo, mail) => {

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
        subject: "Notificacion Horario Laboral",
        text: `${cuerpo}`,
    };
    const transport = nodemailer.createTransport(config);
    const info = await transport.sendMail(mensaje);
    console.log(info)
};

module.exports = {
    probandoMail
}