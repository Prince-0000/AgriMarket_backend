const prisma = require("../../config/db");

const getAllFarmers = async () => {
    return await prisma.farmer.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  };
  
  module.exports = {
    getAllFarmers,
  };