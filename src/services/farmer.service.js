const prisma = require('../config/db');

const getFarmers = async() => {
    return {
        id: 1,
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        phone: "9876543210",
        address: "Village Ramnagar, Sirsa, Haryana",
        createdAt: new Date().toISOString()
      };
}

module.exports = { getFarmers };