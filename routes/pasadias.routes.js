const {Router} = require('express');

const { crearPasadias,obtenerPago } = require('../controllers/pasadias.controller');

const router = Router();

router.post('/', crearPasadias); 
router.post('/paymen', obtenerPago); 

module.exports = router