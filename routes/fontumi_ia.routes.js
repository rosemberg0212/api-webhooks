const { Router } = require("express");

const { realizarReserva, enviarCorreoReservas, envioContenidoMultimedia } = require("../controllers/fontumi_ia.controller");

const router = Router();

router.post("/", realizarReserva);
router.post("/send/mail", enviarCorreoReservas);
router.post("/send/multimedia", envioContenidoMultimedia);

module.exports = router;
