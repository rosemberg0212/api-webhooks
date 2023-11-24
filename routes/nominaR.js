const {Router} = require('express');

const { calcularNomina } = require('../controllers/nomina');

const router = Router();

router.post('/', calcularNomina);


module.exports = router