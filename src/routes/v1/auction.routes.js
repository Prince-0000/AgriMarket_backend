const express = require('express');
const {
  createAuction,
  getAuctionBySlug,
  closeAuction,
  getRetailerAuctions,
  acceptInvitation,
  placeBid
} = require ('../../controllers/v1/auction.controller');

const router = express.Router();

router.post('/create', createAuction);   
router.get('/:slug', getAuctionBySlug);   
router.patch('/:id/close', closeAuction);  
router.post('/bid', placeBid)


router.get('/retailer/:retailer_id', getRetailerAuctions);
router.post('/invite/accept', acceptInvitation);

module.exports = router;
