const {Router} = require('express');

const { felizCumple, InvitacionesAnato, generarQR, videoInnoGrow, requisicones, enviarExcel } = require('../controllers/notificaciones');

const router = Router();

router.post('/',felizCumple);
router.post('/anato',InvitacionesAnato);
router.post('/qr',generarQR);
router.post('/innog',videoInnoGrow);
router.post('/requi',requisicones);
router.post('/excel',enviarExcel);


module.exports = router