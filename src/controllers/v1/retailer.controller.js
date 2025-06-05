const retailerService = require('../../services/v1/retailer.service');

const fetchAllRetailers = async (req, res) => {
  try {
    const retailers = await retailerService.getAllRetailers();
    res.status(200).json(retailers);
  } catch (error) {
    console.error('Error fetching retailers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  fetchAllRetailers,
};
