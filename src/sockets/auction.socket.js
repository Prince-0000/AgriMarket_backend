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

    if (!connectedAuctions.has(auctionId)) {
      startAuctionCountdown(auction, io);
      connectedAuctions.add(auctionId);
    }

    socket.on("placeBid", async ({ bidAmount, quantity }) => {
  if (role !== "retailer")
    return socket.emit("error", "Only retailers can place bids");

  const retailer = await auctionService.getRetailerById(parseInt(roleId));
  if (!retailer) return socket.emit("error", "Retailer not found");

  const currentHighest = await auctionService.getCurrentHighestBid(parseInt(auctionId));
  if (
    currentHighest &&
    parseFloat(bidAmount) <= parseFloat(currentHighest.bid_amount)
  ) {
    return socket.emit("error", "Bid must be higher than the current highest bid");
  }

  await auctionService.createNewBid({
    auctionId: parseInt(auctionId),
    retailerId: retailer.retailer_id,
    bidAmount: parseFloat(bidAmount),
    quantity,
  });

  const updatedBids = await auctionService.getHighestBidsPerRetailer(parseInt(auctionId));
  const top3Bids = updatedBids
    .sort((a, b) => b.bid_amount - a.bid_amount)
    .slice(0, 3);

  io.in(String(auctionId))
    .fetchSockets()
    .then((sockets) => {
      sockets.forEach((s) => {
        if (s.data?.role === "retailer") {
          s.emit("topBids", top3Bids);
        }
        if (s.data?.role === "farmer") {
          s.emit("allBids", updatedBids);
        }
      });
    });
});

  });
};
