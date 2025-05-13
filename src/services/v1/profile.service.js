const prisma = require("../../config/db");

const setupProfile = async (userId, role, profileData) => {
  if (role === 'farmer') {
    const existing = await prisma.farmer.findUnique({
      where: { user_id: userId },
    });
    if (existing) {
      throw new Error('Farmer profile already exists');
    }

    const farmer = await prisma.farmer.create({
      data: {
        user_id: userId,
        farm_name: profileData?.farm_name,
        location: profileData?.location,
        pincode: Number(profileData?.pincode),
        phone: profileData?.phone
      },
    });

    await prisma.user.update({
      where: { user_id: userId },
      data: { role },
    });

    return farmer;
  }

  if (role === 'consumer') {
    const existing = await prisma.consumer.findUnique({
      where: { user_id: userId },
    });
    if (existing) {
      throw new Error('Consumer profile already exists');
    }

    const consumer = await prisma.consumer.create({
      data: {
        user_id: userId,
        preferred_category: profileData.preferred_category,
      },
    });

    await prisma.user.update({
      where: { user_id: userId },
      data: { role },
    });

    return consumer;
  }

  if (role === 'retailer') {
    const existing = await prisma.retailer.findUnique({
      where: { user_id: userId },
    });
    if (existing) {
      throw new Error('Retailer profile already exists');
    }

    const retailer = await prisma.retailer.create({
      data: {
        user_id: userId,
        business_name: profileData.business_name,
      },
    });

    await prisma.user.update({
      where: { user_id: userId },
      data: { role },
    });

    return retailer;
  }

  throw new Error('Invalid role');
};

module.exports = {
  setupProfile,
};
