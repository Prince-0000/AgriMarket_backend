const productService = require('../../services/v1/product.service');

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
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};


const createFeedback = async (req, res) => {
  const { from_user_id, to_farmer_id, rating, comment } = req.body;
  try {
    const feedback = await productService.sendFeedback(from_user_id, to_farmer_id, rating, comment);
    res.json(feedback);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to send feedback' });
  }
};

const getFeedbackByFarmer = async (req, res) => {
  const farmerId = parseInt(req.params.farmerId);
  try {
    const feedbacks = await productService.fetchFeedbackForFarmer(farmerId);
    res.json(feedbacks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};



module.exports = { getAllProducts, getProductById, createFeedback, getFeedbackByFarmer };
