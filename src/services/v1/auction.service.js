const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const slugify = require("slugify");
const { Resend } = require("resend");
const { sendEmail } = require("./email.service");

const resend = new Resend(process.env.RESEND_API_KEY);
// Create Auction and Invite Retailers
const createAuctionService = async (data) => {
  const {
    farmer_id,
    title,
    start_time,
    end_time,
    min_bid_price,
    retailer_ids,
  } = data;

  // Check existence of all retailers
  const existingRetailers = await prisma.retailer.findMany({
    where: { retailer_id: { in: retailer_ids } },
    select: { retailer_id: true },
  });

  const existingIds = existingRetailers.map((r) => r.retailer_id);

  // Throw error if any retailer not found
  const missingIds = retailer_ids.filter((id) => !existingIds.includes(id));
  if (missingIds.length > 0) {
    throw new Error(
      `Retailer(s) not found for ID(s): ${missingIds.join(", ")}`
    );
  }

  const slug = slugify(`${title}-${uuidv4().slice(0, 6)}`, { lower: true });

  const auction = await prisma.auction.create({
    data: {
      title,
      slug,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      min_bid_price,
      status: "open",
      farmer: {
        connect: { farmer_id },
      },
      invitations: {
        create: retailer_ids.map((retailer_id) => ({
          retailer: {
            connect: { retailer_id },
          },
          status: "pending",
        })),
      },
    },
    include: {
      farmer: {
        include: {
          user: true,
        },
      },
      invitations: {
        include: {
          retailer: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  await sendEmail({
    to: auction.farmer.user.email,
    subject: "Auction Created Successfully",
    html: `<h3>Your auction "${auction.title}" has been created.</h3><p>Start: ${auction.start_time}</p><p>End: ${auction.end_time}</p>`,
  });

  for (const invite of auction.invitations) {
    const retailerEmail = invite.retailer.user.email;

    await sendEmail({
      to: retailerEmail,
      subject: "You are Invited to a New Auction",
      html: `<h3>You have been invited to the auction: "${auction.title}".</h3><p>Start: ${auction.start_time}</p><p>End: ${auction.end_time}</p>`,
    });
  }

  return auction;
};

// Retailer can fetch auctions where they are invited
const getRetailerAuctionsService = async (retailer_id) => {
  const invitations = await prisma.invitation.findMany({
    where: { retailer_id },
    include: {
      auction: true,
    },
  });

  return invitations.map((invite) => invite.auction);
};

// Retailer Accept Invitation
const acceptInvitationService = async (auction_id, retailer_id) => {
  const updated = await prisma.invitation.updateMany({
    where: {
      auction_id,
      retailer_id,
      status: "pending",
    },
    data: {
      status: "accepted",
    },
  });

  return updated;
};

const getAuctionBySlugService = async (slug) => {
  return await prisma.auction.findUnique({
    where: { slug },
    include: {
      bids: true,
      invitations: true,
    },
  });
};

const closeAuctionService = async (auction_id) => {
  return await prisma.auction.update({
    where: { auction_id: parseInt(auction_id) },
    data: { status: "closed" },
  });
};

const placeBidService = async ({
  auction_id,
  retailer_id,
  bid_amount,
  quantity,
}) => {
  const bid = await prisma.bidsTransaction.create({
    data: {
      auction_id,
      retailer_id,
      bid_amount,
      quantity,
      status: "pending",
    },
  });

  return bid;
}

module.exports = {
  createAuctionService,
  getRetailerAuctionsService,
  acceptInvitationService,
  getAuctionBySlugService,
  closeAuctionService,
  placeBidService
};
