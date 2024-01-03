const {Router} = require('express');

const { 
    enviarHorarios,
} = require('../controllers/horariosC');

const router = Router();

router.post('/', enviarHorarios);


module.exports = router