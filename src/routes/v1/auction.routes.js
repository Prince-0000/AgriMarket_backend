const express = require('express');
const auctionController = require ('../../controllers/v1/auction.controller');
const { checkJwt, checkAndStoreUser} = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post('/create', checkJwt, auctionController.createAuction);   
router.get('/list/:slug', checkJwt, auctionController.getAuctionBySlug);   
router.patch('/:id/close', checkJwt, auctionController.closeAuction);  
router.post('/bid', checkJwt, auctionController.placeBid)
router.get('/list', checkJwt, checkAndStoreUser, auctionController.getAuctionList);

router.get('/retailer/:retailer_id', checkJwt, auctionController.getRetailerAuctions);
router.post('/invite/accept', checkJwt, auctionController.acceptInvitation);

module.exports = router;
