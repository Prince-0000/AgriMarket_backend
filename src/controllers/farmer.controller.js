const farmerService = require("../services/farmer.service");

const getAllFarmers = async (req, res, next) => {
  try {
    const farmers = await getFarmers();
    res.status(200).json(farmers);
  } catch (err) {
    next(err);
  }
};

const addProduct = async (req, res) => {
    const { farmerId } = req.params;
    const productData = req.body;
  
    try {
      const product = await farmerService.createProduct(farmerId, productData);
      res.status(201).json(product);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  };

const getFarmerProducts = async (req, res) => {
  const { farmerId } = req.params;
  try {
    const products = await farmerService.getFarmerProducts(farmerId);
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await farmerService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, description, price_per_unit, quantity_available, category, image_url } = req.body;

  try {
    const product = await farmerService.updateProduct(parseInt(productId), {
      name,
      description,
      price_per_unit,
      quantity_available,
      category, 
      image_url
    });
    res.json(product);
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).json({ error: err.message });
  }
};
;

const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {  
    await farmerService.deleteProduct(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllFarmers,
  addProduct,
  getFarmerProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
