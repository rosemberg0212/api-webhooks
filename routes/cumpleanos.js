const {Router} = require('express');

const { felizCumple } = require('../controllers/cumpleanos');

const router = Router();

router.post('/',felizCumple);


module.exports = router