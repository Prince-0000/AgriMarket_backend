const express = require('express');
const router = express.Router();
const { fetchAllFarmers } = require("../../controllers/admin/app.routes");
const { checkJwt } = require('../../middlewares/authMiddleware');

router.get('/farmer/list', checkJwt, fetchAllFarmers);

module.exports = router;
