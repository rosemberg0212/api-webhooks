const express = require("express");
const cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      bitrix: "/hook/bitrix",
      bitrixAutocore: "/hook/bitrixAutocore",
      notificaciones: '/hook/notificacion',
      imagenIa: '/hook/imgIa',
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
    this.app.use(this.paths.bitrix, require("../routes/plavih_bitrix_R"));
    this.app.use(this.paths.bitrixAutocore, require("../routes/autocore_bitrix"));
    this.app.use(this.paths.notificaciones, require("../routes/notificaciones.routes"));
    this.app.use(this.paths.imagenIa, require("../routes/imgIA.routes"));
  }

  listem() {
    this.app.listen(this.port, () => {
      console.log("corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
