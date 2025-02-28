const User = require('../models/user');
const { generateToken } = require('../utils/auth');
const admin = require('../utils/firebase');
const validator = require('validator');

const signup = async (name, email, password) => {
  // Validate email
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email');
  }

  // Validate password
  if (!validator.isStrongPassword(password, { minLength: 6, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
    throw new Error('Password must be at least 6 characters long and contain at least one lowercase, one uppercase, one number, and one symbol');
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = new User({ name, email, password });
  await user.save();
  return generateToken(user._id);
};

const login = async (email, password) => {
  // Validate email
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

  return generateToken(user._id);
};

const googleLogin = async (idToken) => {
  try {
    // Verify the Google ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Check if the user already exists
    let user = await User.findOne({ email: decodedToken.email });

    // If the user doesn't exist, create a new user
    if (!user) {
      user = new User({
        name: decodedToken.name,
        email: decodedToken.email,
        googleId: decodedToken.sub,
      });
      await user.save();
    }

    // Generate a JWT token for the user
    const token = generateToken(user._id);
    return token;
  } catch (error) {
    throw new Error('Google login failed: ' + error.message);
  }
};

module.exports = { signup, login, googleLogin };