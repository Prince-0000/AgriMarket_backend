const prisma = require("../config/db");

const getFarmers = async () => {
  return {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "9876543210",
    address: "Village Ramnagar, Sirsa, Haryana",
    createdAt: new Date().toISOString(),
  };
};

const createProduct = async (farmerId, data) => {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price_per_unit: data.price_per_unit,
      quantity_available: data.quantity_available,
      category: data.category,
      image_url: data.image_url,
      farmer_id: parseInt(farmerId),
    },
  });
};

const getFarmerProducts = async (farmerId) => {
  return await prisma.product.findMany({
    where: {
      farmer_id: parseInt(farmerId),
    },
  });
};

const getAllProducts = async () => {
  return await prisma.product.findMany();
};

const updateProduct = async (productId, data) => {
  return await prisma.product.update({
    where: { product_id: parseInt(productId) },
    data,
  });
};

const deleteProduct = async (productId) => {
  console.log("product id", productId)
  return await prisma.product.delete({
    where: {
      product_id: parseInt(productId),
    },
  });
};


module.exports = {
  getFarmers,
  createProduct,
  getFarmerProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
};