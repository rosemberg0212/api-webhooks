const { Router } = require("express");

const { validateToken } = require("../middleware");
const {
  saveHusped,
  usuariosGet,
  updateHuesped,
  checkOutHabitacion,
  createToken,
  findOneHuesped,
} = require("../controllers/userC");

const router = Router();

router.get("/", validateToken, usuariosGet);
router.post("/", validateToken, saveHusped);
router.put("/update/:id", validateToken, updateHuesped);
router.put("/checkout/:hotel", validateToken, checkOutHabitacion);
// router.post("/token", createToken);

//? Rutas desarrollo
router.get("/find/:id", validateToken, findOneHuesped);

module.exports = router;
