const { Router } = require('express');
const { validationAgency } = require('../controllers/anato.controller');

const router = Router();

// POST / -> crea contacto, compañia y negociacion en Bitrix
router.post('/', validationAgency);

module.exports = router;
