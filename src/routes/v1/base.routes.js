const express = require("express");
const farmerRoutes = require("./farmer.routes");
const productRoutes = require("./product.routes");

const router = express.Router();

router.use("/farmer", farmerRoutes);
router.use("/products", productRoutes);

module.exports = router;


