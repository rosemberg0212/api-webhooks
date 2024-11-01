const {Router} = require('express');

const { happyBirthday, userStatus } = require('../controllers/notificaciones');

const router = Router();

router.post('/happyB', happyBirthday);
router.post('/status', userStatus);

module.exports = router