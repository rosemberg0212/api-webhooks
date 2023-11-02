const {Router} = require('express');

const { enviarCertificados } = require('../controllers/certificadosC');

const router = Router();

router.post('/',enviarCertificados);


module.exports = router