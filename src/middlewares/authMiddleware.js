require("dotenv").config();
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-pw043kz5473wulvy.us.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://agrimarket-end',
  issuer: 'https://dev-pw043kz5473wulvy.us.auth0.com/',
  algorithms: ["RS256"],
});

const checkAndStoreUser = async (req, res, next) => {
  try {
    const email = req.auth?.email;
    const name = req.auth?.name;

    if (!email) {
      return res.status(400).json({ message: "Invalid token: Email missing" });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || '', // fallback if name is undefined
          role:"farmer",
        },
      });
      console.log("✅ New middleman stored:", user.email);
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Error storing user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  checkJwt,
  checkAndStoreUser,
};