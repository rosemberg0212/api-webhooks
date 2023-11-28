const { Router } = require("express");

const { validateToken } = require("../middleware");
const {
  usuariosPost,
  usuariosGet,
  switchCheckIn,
  createToken,
} = require("../controllers/userC");

const router = Router();

router.get("/", validateToken, usuariosGet);
router.post("/", validateToken, usuariosPost);
// router.post("/token", createToken);
router.put("/:id", validateToken, switchCheckIn);

module.exports = router;
