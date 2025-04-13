const prisma = require("../config/db");

const pingHandler = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 'PONG' as "PING"`;
    res.status(200).json({
      status: "200",
      message: "OK",
      application: "PONG",
      database: result[0].PING,
    });
  } catch (err) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
    });
  }
};

module.exports = { pingHandler };
