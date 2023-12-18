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
      horario2da: "/hook/horario2da",                 
      horarioSMS: "/hook/horarioSMS",                 
      taskRyver: "/hook/taskRyver",
      nomina: "/hook/nomina",
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
    this.app.use(this.paths.horario2da, require("../routes/horarios2da"));
    this.app.use(this.paths.horarioSMS, require("../routes/horariosSMS"));
    this.app.use(this.paths.taskRyver, require("../routes/taskRyver"));
    this.app.use(this.paths.nomina, require("../routes/nominaR"));
    this.app.use(this.paths.usuarios, require("../routes/userR"));
  }

  listem() {
    this.app.listen(this.port, () => {
      console.log("corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
