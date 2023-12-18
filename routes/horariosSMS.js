const {Router} = require('express');

const { 
    enviarHorariosWindsorSMS
} = require('../controllers/horariosSMS');

const router = Router();

router.post('/WindsorSMS', enviarHorariosWindsorSMS);



module.exports = router