// const OpenAI = require("openai");
// const { enviarEmailGlobal } = require("../helpers");
// const { ImapFlow } = require("imapflow");
// const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// const Imap = require("node-imap");
// const { simpleParser } = require("mailparser");

// function formatDateForIMAP(date) {
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   const day = date.getDate();
//   const month = months[date.getMonth()];
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// }

const agenteSimple = async (req, res) => {
  // Ejemplo de uso:
  // const today = formatDateForIMAP(new Date());
  // // Configuración IMAP
  // const imap = new Imap({
  //   user: process.env.EMAIL_USER,
  //   password: process.env.EMAIL_PASS,
  //   host: "imap.gmail.com",
  //   port: 993,
  //   tls: true,
  // });

  // // Función para abrir carpeta (inbox)
  // function openInbox(cb) {
  //   imap.openBox("INBOX", false, cb);
  // }

  // // Escuchar errores
  // imap.on("error", (err) => {
  //   console.error("❌ Error IMAP:", err);
  // });

  // imap.once("ready", () => {
  //   openInbox((err, box) => {
  //     if (err) throw err;
  //     console.log(`📥 Bandeja abierta: ${box.name}`);

  //     // Buscar correos no leídos
  //     imap.search(["UNSEEN", ['SINCE', today]], (err, results) => {
  //       if (err) throw err;
  //       if (!results.length) {
  //         console.log("No hay correos nuevos.");
  //         imap.end();
  //         return;
  //       }

  //       const f = imap.fetch(results, { bodies: "" });

  //       f.on("message", (msg) => {
  //         msg.on("body", (stream) => {
  //           simpleParser(stream, (err, parsed) => {
  //             if (err) {
  //               console.error("Error parseando correo:", err);
  //               return;
  //             }

  //             console.log("📧 Asunto:", parsed.subject);
  //             console.log("👤 De:", parsed.from.text);
  //             console.log("📝 Texto:", parsed.text);
  //             // console.log("📄 HTML:", parsed.html);
  //           });
  //         });
  //       });

  //       f.once("error", (err) => {
  //         console.error("❌ Error en fetch:", err);
  //       });

  //       f.once("end", () => {
  //         console.log("✅ Correos procesados.");
  //         imap.end();
  //       });
  //     });
  //   });
  // });

  // imap.connect();
};

module.exports = { agenteSimple };
