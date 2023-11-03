const {Router} = require('express');

const { enviarCertificados } = require('../controllers/certificadosC.js');

const router = Router();

router.post('/',enviarCertificados);


module.exports = router