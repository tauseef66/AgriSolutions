const User = require('../models/user');
const bcrypt = require('bcryptjs');

const updateUser = async (userId, updates) => {
  // Hash the password if it is included in the updates
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  // Find the user and update only the provided fields
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

module.exports = { updateUser, deleteUser };