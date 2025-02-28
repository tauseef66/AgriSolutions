const { signup, login, googleLogin } = require('../services/authService');

const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const token = await signup(name, email, password);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    const token = await googleLogin(idToken);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { signupUser, loginUser, googleAuth };