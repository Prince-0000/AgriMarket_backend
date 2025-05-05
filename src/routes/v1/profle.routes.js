const express = require('express');
const router = express.Router();
const { setupUserProfile } = require('../../controllers/v1/profile.controller');
const { checkJwt } = require("../../middlewares/authMiddleware");
const { checkAndStoreUser } = require("../../middlewares/checkUser");

router.post('/setup', checkJwt,checkAndStoreUser, setupUserProfile);

module.exports = router;
