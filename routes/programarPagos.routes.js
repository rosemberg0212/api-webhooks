const {Router} = require('express');

const {  programarPagos} = require('../controllers/programarPagos.controller');

const router = Router();

router.post('/',programarPagos);

module.exports = router