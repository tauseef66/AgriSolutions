const { predictCrop } = require('../services/cropService');
const Prediction = require('../models/prediction');

const predictCropRecommendation = async (req, res) => {
  try {
    const inputData = req.body;
    if (!req.user) {
      throw new Error('Authentication required');
    }
    const userId = req.user.id;
    const result = await predictCrop(inputData);
    
    const prediction = new Prediction({
      userId,
      modelType: 'crop',
      inputData,
      predictionResult: {
        crop: result.prediction,
        confidence: result.confidence
      }
    });
    await prediction.save();
    console.log('[CROP CONTROLLER] Prediction saved:', prediction._id);

    res.status(200).json({ crop: result });
  } catch (error) {
    console.error('[CROP CONTROLLER] Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { predictCropRecommendation };