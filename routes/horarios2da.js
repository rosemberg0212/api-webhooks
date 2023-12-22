const {Router} = require('express');

const { 
    enviarHorariosAixo2da,
    enviarHorariosSantaM2da,
    enviarHorariosRodadero2da,
    enviarHorariosWindsor2da,
    enviarHorariosMadisson2da,
    enviarHorariosReservas2da
} = require('../controllers/horariosC2da');

const router = Router();

router.post('/aixo2da', enviarHorariosAixo2da);
router.post('/reservas2da', enviarHorariosReservas2da);
router.post('/1525Dos', enviarHorariosSantaM2da);
router.post('/rodadero2da', enviarHorariosRodadero2da);
router.post('/windsord2da', enviarHorariosWindsor2da);
router.post('/madisson2da', enviarHorariosMadisson2da);



module.exports = router