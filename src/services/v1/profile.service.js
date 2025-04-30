const prisma = require("../../config/db");

const setupProfile = async (userId, role, profileData) => {
  if (role === 'farmer') {
    const existing = await prisma.farmer.findUnique({
      where: { user_id: userId },
    });
    if (existing) {
      throw new Error('Farmer profile already exists');
    }

    return await prisma.farmer.create({
      data: {
        user_id: userId,
        farm_name: profileData?.farm_name,
        location: profileData?.location,
      },
    });
  }

  if (role === 'consumer') {
    const existing = await prisma.consumer.findUnique({
      where: { user_id: userId },
    });
    if (existing) {
      throw new Error('Consumer profile already exists');
    }

    return await prisma.consumer.create({
      data: {
        user_id: userId,
        preferred_category: profileData.preferred_category,
      },
    });
  }

  if (role === 'retailer') {
    const existing = await prisma.retailer.findUnique({
      where: { user_id: userId },
    });
    if (existing) {
      throw new Error('Retailer profile already exists');
    }

    return await prisma.retailer.create({
      data: {
        user_id: userId,
        business_name: profileData.business_name,
        license_number: profileData.license_number,
      },
    });
  }

  throw new Error('Invalid role');
};

module.exports = {
  setupProfile,
};
