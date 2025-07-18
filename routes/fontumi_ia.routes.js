const { Router } = require("express");

const { realizarReserva } = require("../controllers/fontumi_ia.controller");

const router = Router();

router.post("/", realizarReserva);

module.exports = router;
