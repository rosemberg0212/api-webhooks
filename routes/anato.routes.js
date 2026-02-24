const { Router } = require('express');
const { validationAgency, extractAgencyFromImage, updateAgency } = require('../controllers/anato.controller');

const router = Router();

// POST / -> crea contacto, compañia y negociacion en Bitrix desde datos JSON
router.post('/', validationAgency);

// POST /from-image -> extrae datos de imagen de tarjeta y crea contacto, compañia y negociacion
router.post('/from-image', extractAgencyFromImage);

// PUT /update -> actualiza contacto, compañia o negociacion
router.put('/update', updateAgency);

module.exports = router;
