const {Router} = require('express');

const { main } = require('../controllers/ImgIA.controller');

const router = Router();

router.post('/', main);

module.exports = router