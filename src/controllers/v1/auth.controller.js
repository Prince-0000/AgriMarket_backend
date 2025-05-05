const prisma = require("../../config/db");

const getUserInfo = async (req, res) => {
  console.log(req.auth);
  const userEmail = req.auth?.email;

  if (!userEmail) return res.status(401).json({ error: 'Unauthorized' });

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) return res.status(404).json({ error: 'User not found' });

  res.json(user);
};

module.exports = { getUserInfo };
