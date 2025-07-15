const { predictFertilizer } = require('../services/fertilizerService');

const predictFertilizerRecommendation = async (req, res) => {
  try {
    const result = await predictFertilizer(req.body);
    res.status(200).json({ fertilizer: result });
  } catch (error) {
    console.error('[FERTILIZER CONTROLLER] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { predictFertilizerRecommendation };
