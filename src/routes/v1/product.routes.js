const express = require("express");
const router = express.Router();
const productController = require("../../controllers/v1/product.controller");
const { checkJwt } = require("../../middlewares/authMiddleware");

router.get("/list", checkJwt, productController.getAllProducts);
router.get("/list/:id", checkJwt, productController.getProductById);
router.get("/pin/list", checkJwt, productController.getProductByPincode);
router.post("/feedback/create", checkJwt, productController.createFeedback);
router.get( "/feedback/:farmerId", checkJwt, productController.getFeedbackByFarmer);

module.exports = router;
