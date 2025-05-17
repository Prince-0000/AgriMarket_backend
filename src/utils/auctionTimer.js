const prisma = require('../config/db');

const timers = {};

const startAuctionCountdown = (auction, io) => {
  const auctionId = auction.auction_id;
  const endTime = new Date(auction.end_time).getTime();
  const now = Date.now();
  const remaining = endTime - now;

  if (remaining <= 0) {
    return autoCloseAuction(auctionId, io);
  }

  // Send countdown every second
  timers[auctionId] = setInterval(async () => {
    const timeLeft = new Date(auction.end_time).getTime() - Date.now();
    console.log(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timers[auctionId]);
      await autoCloseAuction(auctionId, io);
    } else {
      io.to(String(auctionId)).emit('countdown', { timeLeft });
    }
  }, 1000);
};

const autoCloseAuction = async (auctionId, io) => {
  const auction = await prisma.auction.update({
    where: { auction_id: auctionId },
    data: { status: 'closed' }
  });

  // Get highest bid
  const winningBid = await prisma.bidsTransaction.findFirst({
    where: { auction_id: auctionId },
    orderBy: { bid_amount: 'desc' },
    include: { retailer: { include: { user: true } } }
  });

  if (winningBid) {
    await prisma.auction.update({
      where: { auction_id: auctionId },
      data: { winner_id: winningBid.retailer_id }
    });

    // Notify winner via email
    // await sendWinnerEmail(winningBid.retailer.user.email, auction.title, winningBid.bid_amount);

    io.to(String(auctionId)).emit('auctionClosed', {
      winner: {
        retailerId: winningBid.retailer_id,
        bidAmount: winningBid.bid_amount,
        name: winningBid.retailer.business_name,
      }
    });
  } else {
    io.to(String(auctionId)).emit('auctionClosed', { winner: null });
  }
};

module.exports = {
  startAuctionCountdown
};
