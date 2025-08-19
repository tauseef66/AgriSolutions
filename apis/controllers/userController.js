const { updateUser, deleteUser, getAllUsers } = require('../services/userService');
const User = require('../models/user');

const getUserDetails = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Invalid token: No user ID provided' });
    }

    const user = await User.findById(req.user.id).select('name email _id');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Fetched user:', user);

    res.status(200).json({
      id: user._id.toString(),
      name: user.name || 'Unknown User',
      email: user.email || 'N/A',
    });
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllUsersDetails = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(
      users.map(user => ({
        id: user._id.toString(),
        name: user.name || 'Unknown User',
        email: user.email || 'N/A',
        createdAt: user.createdAt
          ? new Date(user.createdAt).toISOString()
          : 'N/A'
      }))
    );
  } catch (error) {
    console.error('Error in getAllUsersDetails:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await updateUser(req.user.id, updates);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    await deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getUserDetails, getAllUsersDetails, updateUserProfile, deleteUserProfile };