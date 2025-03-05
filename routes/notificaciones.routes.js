const {Router} = require('express');

const { happyBirthday, userStatus,notificacionContratosVencidos } = require('../controllers/notificaciones.controller');

const router = Router();

router.post('/happyB', happyBirthday);
router.post('/contratos', notificacionContratosVencidos);
router.post('/status', userStatus);

module.exports = router