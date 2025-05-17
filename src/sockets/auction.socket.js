const prisma = require('../config/db');
const { startAuctionCountdown } = require('../utils/auctionTimer');
const verifySocketToken  = require("../utils/verifyToken");

const connectedAuctions = new Set();

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const { auctionId } = socket.handshake.query;
    const token = socket.handshake.headers.token; 
     if (!token) {
        console.log("No token found");
      return ;
    }
    
    const decoded = await verifySocketToken(token);
      const email = decoded.email;
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          farmer: true,
          retailer: true,
        }
      });
      console.log(user);
      if (!user) {
        console.log("user not found");
        return socket.disconnect(true);}

       const role = user.role;
      let roleId = null;

      console.log(auctionId, roleId, role);
    const auction = await prisma.auction.findUnique({
      where: { auction_id: parseInt(auctionId) },
      include: {
        farmer: true,
        invitations: {
          include: {
            retailer: true
          }
        }
      }
    });
    
    if (!auction) {
        console.log("auction not found");
        return socket.disconnect();}

    // 🔒 Role-based Access Check
    if (role === 'retailer') {
        roleId = user.retailer?.retailer_id;

      const invitedRetailer = auction.invitations.find(
        (inv) => inv.retailer_id === parseInt(roleId)
      );
      if (!invitedRetailer){ 
        console.log("error") 
        return socket.disconnect(); 
        }
    }
    

    if (role === 'farmer' ) {
        roleId = user.farmer?.farmer_id;
        if(auction.farmer_id !== parseInt(roleId)){
        console.log("Farmer not found");
        return socket.disconnect();
        }
    }

    socket.join(String(auctionId));

    if (!connectedAuctions.has(auctionId)) {
      startAuctionCountdown(auction, io);
      connectedAuctions.add(auctionId);
    }

    // 🛠 Real-time Bid Logic
    socket.on('placeBid', async ({ bidAmount, quantity }) => {
      if (role !== 'retailer') return socket.emit('error', 'Only retailers can place bids');

      const retailer = await prisma.retailer.findUnique({
        where: { retailer_id: parseInt(roleId) }
      });
      if (!retailer) return socket.emit('error', 'Retailer not found');

      const currentHighest = await prisma.bidsTransaction.findFirst({
        where: { auction_id: parseInt(auctionId) },
        orderBy: { bid_amount: 'desc' }
      });

      if (currentHighest && parseFloat(bidAmount) <= parseFloat(currentHighest.bid_amount)) {
        return socket.emit('error', 'Bid must be higher than the current highest bid');
      }

      const newBid = await prisma.bidsTransaction.create({
        data: {
          auction_id: parseInt(auctionId),
          retailer_id: retailer.retailer_id,
          bid_amount: parseFloat(bidAmount),
          quantity,
          status: 'pending'
        },
        include: {
          retailer: {
            include: { user: true }
          }
        }
      });

      const updatedBids = await prisma.bidsTransaction.findMany({
        where: { auction_id: parseInt(auctionId) },
        orderBy: { bid_amount: 'desc' },
        include: { retailer: { include: { user: true } } }
      });

      io.to(String(auctionId)).emit('bidsUpdate', updatedBids);
    });
  });
};
