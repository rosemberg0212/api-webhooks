const {Router} = require('express');

const {  obtenerUsuarioMonday} = require('../controllers/plavih');

const router = Router();

router.post('/',obtenerUsuarioMonday);

module.exports = router