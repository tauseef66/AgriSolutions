const { updateUser, deleteUser } = require('../services/userService');

const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body; // Get updates from request body
    const user = await updateUser(req.user.id, updates); // Update user
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request parameters
    await deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { updateUserProfile, deleteUserProfile };