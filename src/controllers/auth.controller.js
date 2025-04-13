const HTTP = require("../utils/httpStatus");

const authCheckHandler = (req, res) => {
  res.status(200).json({
    code: HTTP.STATUS_200.CODE,
    message: HTTP.STATUS_200.MESSAGE,
    data: req.auth,
  });
};

module.exports = {
  authCheckHandler,
};
