const prisma = require("../../config/db");

const setupProfile = async (req, res) => {
    try {
      const { user_id, role, extra } = req.body;
  
      // Update user role
      await prisma.user.update({
        where: { user_id },
        data: { role },
      });
  
      // Create role-specific record
      if (role === "farmer") {
        await prisma.farmer.create({
          data: {
            user_id,
            farm_name: extra.farm_name,
            location: extra.location,
          },
        });
      } else if (role === "retailer") {
        await prisma.retailer.create({
          data: {
            user_id,
            business_name: extra.business_name,
            license_number: extra.license_number,
          },
        });
      } else if (role === "consumer") {
        await prisma.consumer.create({
          data: {
            user_id,
            preferred_category: extra.preferred_category || null,
          },
        });
      } else {
        return res.status(400).json({ message: "Invalid role specified." });
      }
  
      res.status(201).json({ message: `${role} profile setup successfully.` });
    } catch (err) {
      console.error("Setup Profile Error:", err);
      res.status(500).json({ message: "Failed to setup profile" });
    }
  };
  
  module.exports = { setupProfile };