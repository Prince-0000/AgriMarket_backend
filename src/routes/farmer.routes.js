const express = require("express");
const { checkJwt, checkAndStoreUser } = require("../middlewares/authMiddleware");
const {getAllFarmers} = require("../controllers/farmer.controller");

const router = express.Router();

router.get("/", checkJwt, checkAndStoreUser, getAllFarmers);

module.exports = router;