const { Router } = require("express");
const { createBitrixSivil } = require("../controllers/bitrix");

const router = Router();

router.post("/create-sivil", createBitrixSivil);

module.exports = router;
