const {Router} = require('express');

const { enviarHorarios,enviarHorariosReservas, enviarHorariosMantenimiento, enviarHorariosSantaM } = require('../controllers/horariosC');

const router = Router();

router.post('/', enviarHorarios);
router.post('/reservas', enviarHorariosReservas);
router.post('/mantenimiento', enviarHorariosMantenimiento);
router.post('/santaM', enviarHorariosSantaM);


module.exports = router