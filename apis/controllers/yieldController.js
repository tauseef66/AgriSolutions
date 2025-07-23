const { predictYield } = require('../services/yieldService');
const Prediction = require('../models/prediction');

const predictYieldRecommendation = async (req, res) => {
  try {
    const inputData = req.body;
    if (!req.user) {
      throw new Error('Authentication required');
    }
    const userId = req.user.id;
    const result = await predictYield(inputData);
    
    const prediction = new Prediction({
      userId,
      modelType: 'yield',
      inputData,
      predictionResult: {
        yield: result.prediction,
        confidence: result.confidence
      }
    });
    await prediction.save();
    console.log('[YIELD CONTROLLER] Prediction saved:', prediction._id);

    res.status(200).json({ yield: result });
  } catch (error) {
    console.error('[YIELD CONTROLLER] Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { predictYieldRecommendation };