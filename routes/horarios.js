const {Router} = require('express');

const { 
    enviarHorarios,
    enviarHorariosReservas, 
    enviarHorariosMantenimiento, 
    enviarHorariosSantaM, 
    enviarHorariosRodadero, 
    enviarHorariosAvexi,
    enviarHorariosAzuan,
    enviarHorariosAbi,
    enviarHorariosBocagrande,
    enviarHorariosWindsor,
    enviarHorariosMadisson,
    enviarHorariosMarina
} = require('../controllers/horariosC');

const router = Router();

router.post('/', enviarHorarios);
router.post('/reservas', enviarHorariosReservas);
router.post('/mantenimiento', enviarHorariosMantenimiento);
router.post('/santaM', enviarHorariosSantaM);
router.post('/rodadero', enviarHorariosRodadero); 
router.post('/avexi', enviarHorariosAvexi); 
router.post('/azuan', enviarHorariosAzuan); 
router.post('/abi', enviarHorariosAbi); 
router.post('/bocag', enviarHorariosBocagrande);  
router.post('/windsor', enviarHorariosWindsor);  
router.post('/madisson', enviarHorariosMadisson);  
router.post('/marina', enviarHorariosMarina);  


module.exports = router