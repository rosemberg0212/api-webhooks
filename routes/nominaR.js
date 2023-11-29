const {Router} = require('express');

const { calcularNomina, calcularNominaReservas } = require('../controllers/nomina');

const router = Router();

router.post('/', calcularNomina);
router.post('/reservas', calcularNominaReservas);


module.exports = router