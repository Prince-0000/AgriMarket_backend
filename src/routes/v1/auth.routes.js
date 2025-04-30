const express = require("express");
const router = express.Router();
const { getUserInfo } = require("../../controllers/v1/auth.controller");
const { checkAndStoreUser } = require("../../middlewares/checkUser");
const { checkJwt } = require("../../middlewares/authMiddleware");

router.get("/user-info", checkJwt, checkAndStoreUser, getUserInfo);

module.exports = router;
