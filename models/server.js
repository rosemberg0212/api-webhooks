const express = require("express");
const cors = require("cors");
const { dbConnection } = require('../db/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      certificado: "/hook/certificado",
      horario: "/hook/horario",               
      taskRyver: "/hook/taskRyver",
      nomina: "/hook/nomina",
      cumpleanos: "/hook/cumple",
      usuarios: "/api/v1/romi-guess",
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
    this.app.use(this.paths.taskRyver, require("../routes/taskRyver"));
    this.app.use(this.paths.nomina, require("../routes/nominaR"));
    this.app.use(this.paths.usuarios, require("../routes/userR"));
    this.app.use(this.paths.cumpleanos, require("../routes/cumpleanos"));
  }

  listem() {
    this.app.listen(this.port, () => {
      console.log("corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
