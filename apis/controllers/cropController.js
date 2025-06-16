const { predictCrop } = require('../services/cropService');

const predictCropRecommendation = async (req, res) => {
  try {
    const inputData = req.body; // Get input data from request body
    const predictedCrop = await predictCrop(inputData); // Predict crop
    res.status(200).json({ crop: predictedCrop });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { predictCropRecommendation };