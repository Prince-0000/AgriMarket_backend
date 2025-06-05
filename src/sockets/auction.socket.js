const { startAuctionCountdown } = require("../utils/auctionTimer");
const verifySocketToken = require("../utils/verifyToken");
const auctionService = require("../sockets/auction.service");

const connectedAuctions = new Set();

module.exports = (io) => {
  io.on("connection", async (socket) => {
    const { auctionId } = socket.handshake.query;
    const token = socket.handshake.headers.token;
    if (!token) {
      console.log("No token found");
      return;
    }

    const decoded = await verifySocketToken(token);
    const email = decoded.email;
    const user = await auctionService.getUserByEmail(email);

    // console.log(user);
    if (!user) {
      console.log("user not found");
      return socket.disconnect(true);
    }

    const role = user.role;
    let roleId = null;

    const auction = await auctionService.getAuctionById(auctionId);

    if (!auction) {
      console.log("auction not found");
      return socket.disconnect();
    }

    // 🔒 Role-based Access Check
    if (role === "retailer") {
      roleId = user.retailer?.retailer_id;

      const invitedRetailer = auction.invitations.find(
        (inv) => inv.retailer_id === parseInt(roleId)
      );
      if (!invitedRetailer) {
        console.log("error");
        return socket.disconnect();
      }
    }

    if (role === "farmer") {
      roleId = user.farmer?.farmer_id;
      if (auction.farmer_id !== parseInt(roleId)) {
        console.log("Farmer not found");
        return socket.disconnect();
      }
    }
    socket.data = {
      role,
      roleId,
    };

    socket.join(String(auctionId));
    console.log(`🔌 ${socket.id} joined auction ${auctionId}`);

    if (!connectedAuctions.has(auctionId)) {
      startAuctionCountdown(auction, io);
      connectedAuctions.add(auctionId);
    }

   
  socket.on("placeBid", async ({ bidAmount, quantity }) => {
  console.log("📨 Bid received:", bidAmount, quantity);

  if (role !== "retailer")
    return socket.emit("error", "Only retailers can place bids");

  const retailer = await auctionService.getRetailerById(parseInt(roleId));
  if (!retailer) return socket.emit("error", "Retailer not found");

  const auctionDetails = await auctionService.getAuctionById(auctionId);
  if (!auctionDetails) return socket.emit("error", "Auction not found");

  const minBidPrice = parseFloat(auctionDetails.min_bid_price);
  const bidValue = parseFloat(bidAmount);

  // ⛔ Bid must be greater than min bid price
  if (bidValue <= minBidPrice) {
    return socket.emit("error", `Bid must be higher than min price ₹${minBidPrice}`);
  }

  // ✅ Get current highest bid
  const currentHighest = await auctionService.getCurrentHighestBid(parseInt(auctionId));

  if (currentHighest) {
    const currentTop = parseFloat(currentHighest.bid_amount);

    // ⛔ If not greater than highest bid, reject
    if (bidValue <= currentTop) {
      return socket.emit("error", `Bid must be higher than current highest bid ₹${currentTop}`);
    }
  }

  // ✅ Passed all checks – create bid
  await auctionService.createNewBid({
    auctionId: parseInt(auctionId),
    retailerId: retailer.retailer_id,
    bidAmount: bidValue,
    quantity,
  });

  // ✅ Broadcast updates
  const updatedBids = await auctionService.getHighestBidsPerRetailer(parseInt(auctionId));
  console.log("✅ Bid saved, broadcasting updates...");

  const top3Bids = [...updatedBids]
    .sort((a, b) => b.bid_amount - a.bid_amount)
    .slice(0, 3);

  const sockets = await io.in(String(auctionId)).fetchSockets();
  sockets.forEach((s) => {
    console.log(`🔍 Emitting to ${s.id} (${s.data?.role})`);

    if (s.data?.role === "retailer") {
      s.emit("topBids", top3Bids);
    } else if (s.data?.role === "farmer") {
      s.emit("allBids", updatedBids);
    }
  });
});


  });
};
