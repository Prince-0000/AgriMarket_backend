const prisma = require("../config/db");

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      farmer: true,
      retailer: true,
    },
  });
};

const getAuctionById = async (auctionId) => {
  return await prisma.auction.findUnique({
    where: { auction_id: parseInt(auctionId) },
    include: {
      farmer: true,
      invitations: {
        include: {
          retailer: true,
        },
      },
    },
  });
};

const getRetailerById = async (retailerId) => {
  return await prisma.retailer.findUnique({
    where: { retailer_id: retailerId },
  });
};

const getCurrentHighestBid = async (auctionId) => {
  return await prisma.bidsTransaction.findFirst({
    where: { auction_id: auctionId },
    orderBy: { bid_amount: "desc" },
  });
};

const createNewBid = async ({ auctionId, retailerId, bidAmount, quantity }) => {
  return await prisma.bidsTransaction.create({
    data: {
      auction_id: auctionId,
      retailer_id: retailerId,
      bid_amount: bidAmount,
      quantity,
      status: "pending",
    },
    include: {
      retailer: {
        include: { user: true },
      },
    },
  });
};

const getHighestBidsPerRetailer = async (auctionId) => {
  const highestBidsPerRetailer = await prisma.bidsTransaction.groupBy({
    by: ["retailer_id"],
    where: { auction_id: auctionId },
    _max: { bid_amount: true },
  });

  return await Promise.all(
    highestBidsPerRetailer.map(async (bid) => {
      return prisma.bidsTransaction.findFirst({
        where: {
          auction_id: auctionId,
          retailer_id: bid.retailer_id,
          bid_amount: bid._max.bid_amount,
        },
        include: {
          retailer: {
            include: { user: true },
          },
        },
      });
    })
  );
};

module.exports = {
  getUserByEmail,
  getAuctionById,
  getRetailerById,
  getCurrentHighestBid,
  createNewBid,
  getHighestBidsPerRetailer,
};
