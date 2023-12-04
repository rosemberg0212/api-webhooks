const {Router} = require('express');

const { calcularNomina, calcularNominaReservas, calcularNominaRodadero } = require('../controllers/nomina');

const router = Router();

router.post('/', calcularNomina);
router.post('/reservas', calcularNominaReservas);
router.post('/rodadero', calcularNominaRodadero);


module.exports = router