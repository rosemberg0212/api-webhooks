const { Router } = require("express");

const { validateToken } = require("../middleware");
const {
  saveHusped,
  usuariosGet,
  changeCheckin,
  createToken,
} = require("../controllers/userC");

const router = Router();

router.get("/", validateToken, usuariosGet);
router.post("/", validateToken, saveHusped);
router.put("/estado/:id", validateToken, changeCheckin);
router.put("/update/:id", validateToken, changeCheckin);
// router.post("/token", createToken);

module.exports = router;
