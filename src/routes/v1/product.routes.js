const express = require('express');
const router = express.Router();
const productController = require('../../controllers/v1/product.controller');

router.get('/list', productController.getAllProducts);
router.get('/list/:id', productController.getProductById);
router.get('/pin/list', productController.getProductByPincode);
router.post('/feedback/create', productController.createFeedback);
router.get('/feedback/:farmerId', productController.getFeedbackByFarmer);

module.exports = router;
  