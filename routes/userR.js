const { Router } = require("express");

const { validateToken } = require("../middleware");
const {
  saveHusped,
  usuariosGet,
  updateHuesped,
  createToken,
} = require("../controllers/userC");

const router = Router();

router.get("/", validateToken, usuariosGet);
router.post("/", validateToken, saveHusped);
router.put("/update/:code_reserva", validateToken, updateHuesped);
// router.post("/token", createToken);

module.exports = router;
