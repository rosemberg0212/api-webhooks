const nodemailer = require("nodemailer");
// const puppeteer = require("puppeteer");
const fs = require("fs");
const sgMail = require("@sendgrid/mail");

const enviarImail = async (cuerpo, mail, asunto) => {
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
  console.log(info);
};

//sendgrid
const enviarMailInnovacion = (cuerpo, mail, asunto) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: mail, // Change to your recipient
    from: "innovacion@gehsuites.com", // Change to your verified sender
    subject: asunto,
    text: cuerpo,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

const correoProveedores = async (cuerpo, mail, asunto) => {
  // 1️⃣ Convertir HTML a PDF con Puppeteer
  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.setContent(cuerpo);
  // await page.pdf({ path: "comprobante.pdf", format: "A4" });
  // await browser.close();
  try {
    const config = {
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "operaciones@gehsuites.com",
        pass: process.env.MAIL_CONTRA_APP_OPERACION,
      },
    };

    const mensaje = {
      from: "operaciones@gehsuites.com",
      to: `${mail}`,
      subject: `${asunto}`,
      html: `${cuerpo}`,
      // attachments: [
      //     {
      //         filename: "comprobante.pdf",
      //         path: "comprobante.pdf",
      //         contentType: "application/pdf",
      //     },
      // ],
    };
    const transport = nodemailer.createTransport(config);
    const info = await transport.sendMail(mensaje);
    console.log("Correo enviado");
  } catch (error) {
    console.log("Error al enviar correo:", error);
  }
};

const enviarEmailGlobal = async (cuerpo, mail, asunto) => {
  try {
    const config = {
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };

    const mensaje = {
      from: process.env.EMAIL_USER,
      to: `${mail}`,
      subject: `${asunto}`,
      text: `${cuerpo}`,
    };
    const transport = nodemailer.createTransport(config);
    const info = transport.sendMail(mensaje);
    console.log('Correo enviado');
    return info;
  } catch (error) {
    console.log('Error al enviar el correo', error);
    return error
  }
};

module.exports = {
  enviarImail,
  correoProveedores,
  enviarMailInnovacion,
  enviarEmailGlobal,
};
