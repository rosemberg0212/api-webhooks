const {Router} = require('express');

const { enviarHorarios,enviarHorariosReservas } = require('../controllers/horariosC');

const router = Router();

router.post('/', enviarHorarios);
router.post('/reservas', enviarHorariosReservas);


module.exports = router