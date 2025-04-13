const HTTP = require("../utils/httpStatus");

const healthCheckHandler = (req, res) => {
  res.status(200).json({
    status: HTTP.STATUS_200.CODE,
    message: HTTP.STATUS_200.MESSAGE,
  });
};

module.exports = {
  healthCheckHandler
};
