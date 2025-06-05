const prisma = require('../config/db');
const { sendEmail } = require("../services/v1/email.service");
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
    // console.log(timeLeft);
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

  const userEmail = winningBid.retailer?.user?.email;
  const businessName = winningBid.retailer?.business_name;

  if (userEmail) {
    await sendEmail({
      to: userEmail,
      subject: `🎉 Congratulations! You won the auction: ${auction.title}`,
      html: `
        <h2>Congratulations ${businessName}!</h2>
        <p>You have won the auction <strong>${auction.title}</strong> with a bid of <strong>₹${winningBid.bid_amount}</strong>.</p>
        <p>We'll contact you with further steps.</p>
        <br />
        <p>Thank you,<br/>AgriMarket Team</p>
      `,
    });
  }

  io.to(String(auctionId)).emit('auctionClosed', {
    winner: {
      retailerId: winningBid.retailer_id,
      bidAmount: winningBid.bid_amount,
      name: businessName,
    }
  });
} else {
  io.to(String(auctionId)).emit('auctionClosed', { winner: null });
}

};

module.exports = {
  startAuctionCountdown
};
