const express = require("express");
const farmerRoutes = require("./farmer.routes");

const router = express.Router();

router.use("/farmer", farmerRoutes);

module.exports = router;


