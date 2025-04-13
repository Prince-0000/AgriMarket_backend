const HTTP = require("../utils/httpStatus");

const authCheckHandler = (req, res) => {
  try {
    if (!req.auth) {
      return res.status(401).json({
        code: HTTP.STATUS_401.CODE,
        message: HTTP.STATUS_401.MESSAGE,
      });
    }

    res.status(200).json({
      code: HTTP.STATUS_200.CODE,
      message: HTTP.STATUS_200.MESSAGE,
      data: req.auth,
    });
  } catch (error) {
    console.error("Auth Check Error:", error.message);
    res.status(500).json({
      code: HTTP.STATUS_500.CODE,
      message: HTTP.STATUS_500.MESSAGE,
    });
  }
};

module.exports = {
  authCheckHandler,
};
