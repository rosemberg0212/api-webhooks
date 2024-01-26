const {Router} = require('express');

const { felizCumple, InvitacionesAnato } = require('../controllers/cumpleanos');

const router = Router();

router.post('/',felizCumple);
router.post('/anato',InvitacionesAnato);


module.exports = router