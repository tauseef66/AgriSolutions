const User = require('../models/user');
const bcrypt = require('bcryptjs');

const updateUser = async (userId, updates) => {
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  return user;
};

const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
};

const getAllUsers = async () => {
  return await User.find();
};

module.exports = { updateUser, deleteUser, getAllUsers };