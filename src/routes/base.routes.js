const express = require("express");
const v1Router = require("./v1/base.routes");
const { healthCheck } = require("../controllers/health.controller");

const router = express.Router();

router.get("/ping", healthCheck);

router.use("/api/v1", v1Router);

module.exports = router;