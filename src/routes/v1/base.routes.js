const express = require("express");
const farmerRoutes = require("./farmer.routes");
const productRoutes = require("./product.routes");
const authRoutes = require("./auth.routes");
const profileRoutes = require("./profle.routes");

const router = express.Router();

router.use("/farmer", farmerRoutes);
router.use("/products", productRoutes);
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);

module.exports = router;


