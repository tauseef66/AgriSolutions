const { predictYield } = require('../services/yieldService');

const predictYieldEstimation = async (req, res) => {
  try {
    const inputData = req.body; // Get input data from request body
    const predictedYield = await predictYield(inputData); // Predict yield
    res.status(200).json({ yield: predictedYield });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { predictYieldEstimation };