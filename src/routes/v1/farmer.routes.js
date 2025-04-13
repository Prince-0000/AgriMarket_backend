const express = require("express");
const { checkJwt } = require("../../middlewares/authMiddleware");
const farmerController = require("../../controllers/v1/farmer.controller");

const router = express.Router();

router.get("/", checkJwt, farmerController.getAllFarmers);

router.post('/add/:farmerId', checkJwt, farmerController.addProduct);

router.get('/products/:farmerId', checkJwt, farmerController.getFarmerProducts);

router.get('/all/products', checkJwt, farmerController.getAllProducts);

router.put('/product/:productId', checkJwt, farmerController.updateProduct);

router.delete('/product/:productId', checkJwt, farmerController.deleteProduct);


module.exports = router;