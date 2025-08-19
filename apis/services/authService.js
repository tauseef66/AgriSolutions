const User = require('../models/user');
const { generateToken } = require('../utils/auth');
const admin = require('../utils/firebase');
const validator = require('validator');

const signup = async (name, email, password) => {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }

  if (!validator.isStrongPassword(password, { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
    throw new Error('Password must be at least 6 characters long and contain at least one lowercase, one uppercase, one number, and one symbol');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = new User({ name, email, password });
  await user.save();
  return generateToken(user._id);
};

const login = async (email, password) => {
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id, user.isAdmin);
  return { token, isAdmin: user.isAdmin };
};

const googleLogin = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    let user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      user = new User({
        name: decodedToken.name,
        email: decodedToken.email,
        googleId: decodedToken.sub,
      });
      await user.save();
    }

    const token = generateToken(user._id);
    return token;
  } catch (error) {
    throw new Error('Google login failed: ' + error.message);
  }
};

module.exports = { signup, login, googleLogin };