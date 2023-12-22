const { Router } = require("express");
const {} = require("../controllers/userC");

const router = Router();

router.get("/", validateToken, usuariosGet);

module.exports = router;
