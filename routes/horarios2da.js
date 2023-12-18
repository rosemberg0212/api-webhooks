const {Router} = require('express');

const { 
    enviarHorariosAixo2da
} = require('../controllers/horariosC2da');

const router = Router();

router.post('/aixo2da', enviarHorariosAixo2da);



module.exports = router