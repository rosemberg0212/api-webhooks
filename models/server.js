const express = require("express");
const cors = require("cors");
const path = require("path");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      bitrix: "/hook/bitrix",
      bitrixAutocore: "/hook/bitrixAutocore",
      notificaciones: '/hook/notificacion',
      imagenIa: '/hook/imgIa',
      pasadia: '/hook/pasadia',
      pagos: '/hook/pagos/cobre',
      fontumi: '/hook/fontumi/reservar',
      openia: '/hook/openia',
      almuerzos: '/api/almuerzos',
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
    this.app.use(this.paths.bitrix, require("../routes/plavih_bitrix_R.routes"));
    this.app.use(this.paths.bitrixAutocore, require("../routes/autocore_bitrix"));
    this.app.use(this.paths.notificaciones, require("../routes/notificaciones.routes"));
    this.app.use(this.paths.imagenIa, require("../routes/imgIA.routes"));
    this.app.use(this.paths.pasadia, require("../routes/pasadias.routes"));
    this.app.use(this.paths.pagos, require("../routes/programarPagos.routes"));
    this.app.use(this.paths.fontumi, require("../routes/fontumi_ia.routes"));
    this.app.use(this.paths.openia, require("../routes/agentes_openia.routes"));
    this.app.use(this.paths.almuerzos, require("../routes/almuerzos.routes"));
    
    // Ruta específica para la página de almuerzos
    this.app.get('/almuerzos', (req, res) => {
      res.sendFile(path.join(__dirname, '../public', 'almuerzos.html'));
    });
  }

  listem() {
    this.app.listen(this.port, () => {
      console.log("corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
