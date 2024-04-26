const {Router} = require('express');

const { felizCumple, generarQR, requisicones, enviarExcel } = require('../controllers/notificaciones');

const router = Router();

router.post('/',felizCumple);
router.post('/qr',generarQR);
router.post('/requi',requisicones);
router.post('/excel',enviarExcel);


module.exports = router