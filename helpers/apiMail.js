const probandoMail = async (cuerpo, mail) => {
    const nodemailer = require("nodemailer");

    const config = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "rosemberc.g.02@gmail.com",
            pass: "juls pfhz gggg apzr",
        },
    };

    const mensaje = {
        from: "rosemberc.g.02@gmail.com",
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