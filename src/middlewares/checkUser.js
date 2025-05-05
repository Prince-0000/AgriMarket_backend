const prisma = require("../config/db");

const checkAndStoreUser = async (req, res, next) => {
    try {
      console.log(req.auth);
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
            name: name || "",
            role: null,
          },
        });
      }
  
      req.user = user;
      next();
    } catch (err) {
      console.error("Error storing user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  module.exports = { checkAndStoreUser };