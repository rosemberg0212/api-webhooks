const { Router } = require("express");
const {
  createBitrixSivil,
  createBitrixSPQR,
} = require("../controllers/bitrix");

const router = Router();

router.post("/create-sivil", createBitrixSivil);
router.post("/create-spqr", createBitrixSPQR);

module.exports = router;
