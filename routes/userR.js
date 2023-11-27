const { Router } = require("express");

const { usuariosPost, usuariosGet } = require("../controllers/userC");

const router = Router();

router.post("/", usuariosPost);
router.get("/", usuariosGet);

module.exports = router