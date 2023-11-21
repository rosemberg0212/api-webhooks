const { Router } = require('express');

const { enviarFormPQRS } = require('../controllers/pqrsRomiC.js');

const router = Router();

router.post('/', enviarFormPQRS);


module.exports = router