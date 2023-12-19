const {Router} = require('express');

const { 
    enviarHorariosWindsorSMS,
    probandoMail
} = require('../controllers/horariosSMS');

const router = Router();

router.post('/WindsorSMS', enviarHorariosWindsorSMS);
// router.post('/mail', probandoMail);



module.exports = router