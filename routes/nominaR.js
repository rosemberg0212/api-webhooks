const {Router} = require('express');

const { calcularNomina, generarTirilla} = require('../controllers/nomina');

const router = Router();

router.post('/', calcularNomina);
router.post('/tirilla', generarTirilla);


module.exports = router