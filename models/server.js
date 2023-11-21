const express = require('express')
const cors = require('cors');

class Server {
    constructor(){
        this.app = express()
        this.port = process.env.PORT;

        this.paths = {
            certificado:   '/hook/certificado',
            horario:       '/hook/horario',
            pqrdRomi:      '/hook/pqrs'
        }

        //Middlewares
        this.Middlewares()

        //Rutas de mi aplicacion
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
    }

    Middlewares(){
        //CORS
        this.app.use(cors());

        //lectura y parseo del body
        this.app.use(express.json());

        //directorio publico
        this.app.use(express.static('public'))

    }
    
    routes(){
        this.app.use(this.paths.certificado, require('../routes/certificado'));
        this.app.use(this.paths.horario, require('../routes/horarios'));
        this.app.use(this.paths.pqrdRomi, require('../routes/pqrsRomi'));
    }

    listem(){
        this.app.listen(this.port, ()=>{
            console.log('corriendo en el puerto', this.port)
        }) 
    }
}

module.exports = Server;