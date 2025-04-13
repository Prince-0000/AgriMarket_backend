const express = require("express");
const v1Router = require("./v1/base.routes");
const { pingHandler } = require("../controllers/ping.controller");
const { healthCheckHandler } = require("../controllers/health.controller");
const { checkJwt } = require("../middlewares/authMiddleware");
const { authCheckHandler } = require("../controllers/auth.controller");

const router = express.Router();

router.get("/ping", pingHandler);
router.get("/health/check", healthCheckHandler)
router.get("/auth/check", checkJwt, authCheckHandler)
router.use("/api/v1", v1Router);

module.exports = router;