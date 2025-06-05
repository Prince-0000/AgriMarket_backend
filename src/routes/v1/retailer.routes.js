const express = require('express');
const router = express.Router();
const retailerController = require('../../controllers/v1/retailer.controller');

router.get('/list', retailerController.fetchAllRetailers);

module.exports = router;
