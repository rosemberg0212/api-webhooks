const { Router } = require("express");

const { infoRyver } = require("../controllers/taskRyverC");

const router = Router();

router.post("/", infoRyver);
