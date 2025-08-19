const mongoose = require('mongoose');
const Prediction = require('../models/prediction');

const getUserPredictions = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found' });
    }
    const predictions = await Prediction.find({
      userId,
      predictionResult: { $ne: null }
    })
      .sort({ createdAt: -1 })
      .limit(50);
    console.log('[PREDICTION CONTROLLER] Fetched predictions for user:', userId, predictions);
    res.status(200).json({
      status: 'success',
      data: predictions,
    });
  } catch (error) {
    console.error('[PREDICTION CONTROLLER] Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

const getAllPredictions = async (req, res) => {
  try {
    const predictions = await Prediction.find({})
      .sort({ createdAt: -1 });  

    console.log(`[PREDICTION CONTROLLER] Fetched ${predictions.length} total predictions`);
    res.status(200).json({
      status: 'success',
      count: predictions.length,
      data: predictions,
    });
  } catch (error) {
    console.error('[PREDICTION CONTROLLER] Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getUserPredictions, getAllPredictions };