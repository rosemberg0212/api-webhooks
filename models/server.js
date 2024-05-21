const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      certificado: "/hook/certificado",
      horario: "/hook/horario",
      nomina: "/hook/nomina",
      notificaciones: "/hook/notifi",
      plavih: "/hook/plavih",
      bitrix: "/hook/bitrix",
      bitrixMonday: "/hook/bitrixMonday",
    };

    //Middlewares
    this.Middlewares();

    //Rutas de mi aplicacion
    this.routes();
  }

  Middlewares() {
    //CORS
    this.app.use(cors());

    //lectura y parseo del body
    this.app.use(express.json());

    //directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.certificado, require("../routes/certificado"));
    this.app.use(this.paths.horario, require("../routes/horarios"));
    this.app.use(this.paths.nomina, require("../routes/nominaR"));
    this.app.use(
      this.paths.notificaciones,
      require("../routes/notificaciones")
    );
    this.app.use(this.paths.plavih, require("../routes/plavih"));
    this.app.use(this.paths.bitrix, require("../routes/plavih_bitrix_R"));
    this.app.use(this.paths.bitrixMonday, require("../routes/bitrixR"));
  }

  listem() {
    this.app.listen(this.port, () => {
      console.log("corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
