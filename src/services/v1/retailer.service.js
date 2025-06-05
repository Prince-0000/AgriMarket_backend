const prisma = require('../../config/db');

const getAllRetailers = async () => {
  return await prisma.retailer.findMany({
    include: {
      user: true,
    },
  });
};

module.exports = {
  getAllRetailers,
};
