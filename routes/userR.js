const { Router } = require("express");
const { checkInGreetings, checkOut } = require("../controllers/userC");

const router = Router();

router.post("/", checkInGreetings);
router.post("/checkout", checkOut);

module.exports = router;
