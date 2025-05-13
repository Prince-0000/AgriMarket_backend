const prisma = require("../../config/db");

const getUserInfo = async (req, res) => {
  const userEmail = req.auth?.email;

  if (!userEmail) return res.status(401).json({ error: "Unauthorized" });

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      farmer: { select: { farmer_id: true } },
      consumer: { select: { consumer_id: true } },
      retailer: { select: { retailer_id: true } },
    },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
};


module.exports = { getUserInfo };
