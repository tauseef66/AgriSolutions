const mongoose = require('mongoose');
const Prediction = require('../models/prediction');

const getUserPredictions = async (req, res) => {
  try {
    const userId = req.user?.id || guestUserId;
    const predictions = await Prediction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    console.log('[PREDICTION CONTROLLER] Fetched predictions for user:', userId);
    res.status(200).json({ predictions });
  } catch (error) {
    console.error('[PREDICTION CONTROLLER] Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getUserPredictions };