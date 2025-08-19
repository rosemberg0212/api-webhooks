const {Router} = require('express');

const { happyBirthday, userStatus, notificacionContratosVencidos, getUsersStatus } = require('../controllers/notificaciones.controller');

const router = Router();

router.post('/happyB', happyBirthday);
router.post('/contratos', notificacionContratosVencidos);
router.post('/status', userStatus);
router.get('/users-status', getUsersStatus);

module.exports = router