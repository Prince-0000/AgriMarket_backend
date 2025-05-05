const { getAllFarmers } = require('../../services/admin/app.services');

const fetchAllFarmers = async (req, res) => {
  try {
    const farmers = await getAllFarmers();
    res.status(200).json(farmers);
  } catch (err) {
    console.error('❌ Error fetching farmers:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  fetchAllFarmers,
};
