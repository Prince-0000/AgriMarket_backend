const productService = require("../../services/v1/product.service");

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const product = await productService.fetchProductById(id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

const getProductByPincode = async (req, res) => {
  try {
    const { pincode } = req.query;
    const pincodeNumber = parseInt(pincode, 10);
    if (!pincode) {
      return res
        .status(400)
        .json({ message: "userId and pincode are required" });
    }

    const products = await productService.productsByPincode(pincodeNumber);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in submitPincode:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createFeedback = async (req, res) => {
  const { from_user_id, to_farmer_id, rating, comment } = req.body;
  try {
    const feedback = await productService.sendFeedback(
      from_user_id,
      to_farmer_id,
      rating,
      comment
    );
    res.json(feedback);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to send feedback" });
  }
};

const getFeedbackByFarmer = async (req, res) => {
  const farmerId = parseInt(req.params.farmerId);
  try {
    const feedbacks = await productService.fetchFeedbackForFarmer(farmerId);
    res.json(feedbacks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductByPincode,
  createFeedback,
  getFeedbackByFarmer,
};
