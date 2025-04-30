const { checkUserProfileStatus } = require("../../services/v1/auth.service");

const getUserInfo = async (req, res) => {
  try {
    const user = req.user;
    const isProfileSetup = await checkUserProfileStatus(user);
    
    return res.status(200).json({
      user,
      isProfileSetup,
    });
  } catch (err) {
    console.error("Error getting user info:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getUserInfo };
