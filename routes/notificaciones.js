const {Router} = require('express');

const { felizCumple, InvitacionesAnato, generarQR, videoInnoGrow } = require('../controllers/notificaciones');

const router = Router();

router.post('/',felizCumple);
router.post('/anato',InvitacionesAnato);
router.post('/qr',generarQR);
router.post('/innog',videoInnoGrow);


module.exports = router