const {Router} = require('express');

const { obtenerDatosB, actualizarDatosPagos } = require('../controllers/autocore_bitrix');

const router = Router();

router.post('/:id',obtenerDatosB);
router.post('/update/pago',actualizarDatosPagos);

module.exports = router