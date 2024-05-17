const {Router} = require('express');

const {  obtenerDatosUsuario} = require('../controllers/plavih_bitrix');

const router = Router();

router.post('/:id',obtenerDatosUsuario);

module.exports = router