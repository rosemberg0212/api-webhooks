const { Router } = require("express");

const { usuariosPost } = require("../controllers/userC");

const router = Router();

router.post("/", usuariosPost);

module.exports = router