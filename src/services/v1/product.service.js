const prisma = require("../../config/db");

const getAllProducts = async () => {
  return await prisma.product.findMany();
};

const fetchProductById = async (id) => {
  return await prisma.product.findUnique({
    where: { product_id: id },
    include: {
      farmer: {
        include: {
          user: {
            select: { name: true, email: true, region: true }
          }
        }
      }
    }
  });
};

const sendFeedback = async (from_user_id, to_farmer_id, rating, comment) => {
  const farmer = await prisma.farmer.findUnique({
    where: { farmer_id: parseInt(to_farmer_id) },
    include: { user: true }
  });

  if (!farmer) {
    throw new Error("The farmer you're trying to review was not found.");
  }

  return await prisma.feedback.create({
    data: {
      from_user: parseInt(from_user_id),
      to_user: farmer.user_id,
      rating: parseInt(rating),
      comment
    }
  });
};

const fetchFeedbackForFarmer = async (farmerId) => {
  const farmer = await prisma.farmer.findUnique({
    where: { farmer_id: farmerId },
    include: { user: true }
  });

  if (!farmer) {
    throw new Error("Farmer not found.");
  }

  return await prisma.feedback.findMany({
    where: {
      to_user: farmer.user_id,
    },
    include: {
      from: {
        select: {
          name: true, 
        }
      },
      to: {
        select: {
          user_id: true 
        }
      },
    }
  });
};



module.exports = { getAllProducts, fetchProductById, sendFeedback, fetchFeedbackForFarmer };
