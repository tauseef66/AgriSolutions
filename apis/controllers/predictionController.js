const mongoose = require('mongoose');
const Prediction = require('../models/prediction');

const getUserPredictions = async (req, res) => {
  try {
    // Default guest user ID (replace with actual ObjectId from your Users collection)
    const guestUserId = new mongoose.Types.ObjectId('000000000000000000000000');
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

// // Version with authentication middleware
// const mongoose = require('mongoose');
// const Prediction = require('../models/prediction');
//
// const getUserPredictions = async (req, res) => {
//   try {
//     if (!req.user) {
//       throw new Error('Authentication required');
//     }
//     const userId = req.user.id;
//     const predictions = await Prediction.find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(50);
//     console.log('[PREDICTION CONTROLLER] Fetched predictions for user:', userId);
//     res.status(200).json({ predictions });
//   } catch (error) {
//     console.error('[PREDICTION CONTROLLER] Error:', error.message);
//     res.status(400).json({ message: error.message });
//   }
// };
//
// module.exports = { getUserPredictions };