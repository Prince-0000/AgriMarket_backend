const express = require("express");
const v1Router = require("./v1/base.routes");
const adminRouter = require("./admin/app.routes");
const { pingHandler } = require("../controllers/ping.controller");
const { healthCheckHandler } = require("../controllers/health.controller");
const { checkJwt } = require("../middlewares/authMiddleware");
const { authCheckHandler } = require("../controllers/auth.controller");
const { checkAndStoreUser } = require("../middlewares/checkUser")

const router = express.Router();

router.get("/ping", pingHandler);
router.get("/health/check", healthCheckHandler)
router.get("/auth/check", checkJwt, checkAndStoreUser, authCheckHandler)
router.use("/api/v1", v1Router);
router.use("/api/admin", adminRouter);

module.exports = router;