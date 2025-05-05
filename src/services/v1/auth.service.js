const prisma = require("../../config/db");

const checkUserProfileStatus = async (user) => {
  switch (user.role) {
    case "farmer":
      return !!(await prisma.farmer.findUnique({ where: { user_id: user.user_id } }));

    case "retailer":
      return !!(await prisma.retailer.findUnique({ where: { user_id: user.user_id } }));

    case "consumer":
      return !!(await prisma.consumer.findUnique({ where: { user_id: user.user_id } }));

    default:
      return false;
  }
};

module.exports = { checkUserProfileStatus };
