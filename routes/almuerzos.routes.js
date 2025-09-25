const { Router } = require("express");

const { 
  consultarAlmuerzos, 
  listarMesesDisponibles 
} = require("../controllers/almuerzos.controller");

const router = Router();

// GET /api/almuerzos/:cedula?month=YYYY-MM
router.get("/:cedula", consultarAlmuerzos);

// GET /api/almuerzos/meses (para obtener meses disponibles)
router.get("/", listarMesesDisponibles);

module.exports = router;