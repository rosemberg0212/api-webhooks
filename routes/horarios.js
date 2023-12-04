const {Router} = require('express');

const { enviarHorarios,enviarHorariosReservas, enviarHorariosMantenimiento, enviarHorariosSantaM, enviarHorariosRodadero } = require('../controllers/horariosC');

const router = Router();

router.post('/', enviarHorarios);
router.post('/reservas', enviarHorariosReservas);
router.post('/mantenimiento', enviarHorariosMantenimiento);
router.post('/santaM', enviarHorariosSantaM);
router.post('/rodadero', enviarHorariosRodadero);


module.exports = router