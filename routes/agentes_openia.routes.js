const { Router } = require("express");

const { agenteSimple } = require("../controllers/agente_ia_openai.controller");

const router = Router();

router.post("/agente", agenteSimple);

module.exports = router;
