const {Router} = require('express');

const {  programarPagos, obtenerDatosPago} = require('../controllers/programarPagos.controller');

const router = Router();

router.post('/',programarPagos);
router.post('/suscription',obtenerDatosPago);

module.exports = router