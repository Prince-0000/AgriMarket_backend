const { setupProfile } = require('../../services/v1/profile.service');

const setupUserProfile = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.user_id;
    const role = req.user?.role;
    console.log(req.body);
    const profileData = req.body?.profileData;

    if (!userId || !role) {
      return res.status(400).json({ message: 'Missing user ID or role' });
    }

    const result = await setupProfile(userId, role, profileData);
    res.status(201).json({ message: 'Profile created successfully', data: result });
  } catch (err) {
    console.error('❌ Error setting up profile:', err);
    res.status(500).json({ message: 'Internal Server Error1' });
  }
};

module.exports = {
  setupUserProfile,
};
