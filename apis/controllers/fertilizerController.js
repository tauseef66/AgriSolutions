const { predictFertilizer } = require('../services/fertilizerService');
const Prediction = require('../models/prediction');

const predictFertilizerRecommendation = async (req, res) => {
  try {
    const inputData = req.body;
    if (!req.user) {
      throw new Error('Authentication required');
    }
    const userId = req.user.id;
    const result = await predictFertilizer(inputData);
    
    const prediction = new Prediction({
      userId,
      modelType: 'fertilizer',
      inputData,
      predictionResult: {
        fertilizer: result.prediction,
        remark: result.remark,
        confidence: result.confidence
      }
    });
    await prediction.save();
    console.log('[FERTILIZER CONTROLLER] Prediction saved:', prediction._id);

    res.status(200).json({ fertilizer: result });
  } catch (error) {
    console.error('[FERTILIZER CONTROLLER] Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { predictFertilizerRecommendation };