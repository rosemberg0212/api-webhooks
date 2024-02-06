const {Router} = require('express');

const { felizCumple, InvitacionesAnato, generarQR } = require('../controllers/notificaciones');

const router = Router();

router.post('/',felizCumple);
router.post('/anato',InvitacionesAnato);
router.post('/qr',generarQR);


module.exports = router