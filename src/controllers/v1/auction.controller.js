const {
  createAuctionService, getRetailerAuctionsService, closeAuctionService, getAuctionBySlugService, acceptInvitationService, placeBidService
} = require ('../../services/v1/auction.service');

const createAuction = async (req, res) => {
  try {

    const auction = await createAuctionService(req.body);
    res.status(201).json(auction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create auction' });
  }
};

const getAuctionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const auction = await getAuctionBySlugService(slug);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.json(auction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching auction' });
  }
};

const closeAuction = async (req, res) => {
  try {
    const { id } = req.params;
    const auction = await closeAuctionService(id);
    res.json({ message: 'Auction closed', auction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error closing auction' });
  }
};

const getRetailerAuctions = async (req, res) => {
  try {
    const auctions = await getRetailerAuctionsService(parseInt(req.params.retailer_id));
    res.status(200).json({ success: true, auctions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const acceptInvitation = async (req, res) => {
  try {
    const { auction_id, retailer_id } = req.body;
    const invitation = await acceptInvitationService(auction_id, retailer_id);
    res.status(200).json({ success: true, invitation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const placeBid = async (req, res) => {
  try {
    const bid = await placeBidService(req.body);
    res.status(201).json(bid);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error placing bid' });
  }
}

module.exports = { createAuction, getAuctionBySlug, closeAuction, getRetailerAuctions, acceptInvitation, placeBid}
