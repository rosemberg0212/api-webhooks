const {Router} = require('express');

const { 
    enviarHorariosWindsorSMS,
    enviarHorariosWindsorMail
} = require('../controllers/horariosSMS');

const router = Router();

router.post('/WindsorSMS', enviarHorariosWindsorSMS);
router.post('/mail', enviarHorariosWindsorMail);



module.exports = router