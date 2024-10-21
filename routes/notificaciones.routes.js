const {Router} = require('express');

const { happyBirthday } = require('../controllers/notificaciones');

const router = Router();

router.post('/happyB', happyBirthday);

module.exports = router