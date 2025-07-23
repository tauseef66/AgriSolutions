// const Review = require('../models/review');

// const addReview = async (req, res) => {
//   try {
//     if (!req.user) {
//       throw new Error('Authentication required');
//     }
//     const { modelType, rating, comment } = req.body;
//     const userId = req.user.id;

//     if (!['crop', 'yield', 'fertilizer', 'general'].includes(modelType)) {
//       console.error('[REVIEW CONTROLLER] Invalid model type:', modelType);
//       throw new Error('Invalid model type');
//     }
//     if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
//       console.error('[REVIEW CONTROLLER] Invalid rating:', rating);
//       throw new Error('Rating must be an integer between 1 and 5');
//     }

//     const review = new Review({
//       userId,
//       modelType,
//       rating,
//       comment
//     });
//     await review.save();
//     console.log('[REVIEW CONTROLLER] Review saved:', review._id);

//     res.status(201).json({ review });
//   } catch (error) {
//     console.error('[REVIEW CONTROLLER] Error:', error.message);
//     res.status(400).json({ message: error.message });
//   }
// };

// const getReviews = async (req, res) => {
//   try {
//     const { modelType } = req.query;
//     const query = modelType ? { modelType } : {};
//     const reviews = await Review.find(query)
//       .populate('userId', 'username')
//       .sort({ createdAt: -1 })
//       .limit(50);
//     console.log('[REVIEW CONTROLLER] Fetched reviews:', reviews.length);
//     res.status(200).json({ reviews });
//   } catch (error) {
//     console.error('[REVIEW CONTROLLER] Error:', error.message);
//     res.status(400).json({ message: error.message });
//   }
// };

// module.exports = { addReview, getReviews };

const mongoose = require('mongoose');
const Review = require('../models/review');

const addReview = async (req, res) => {
  try {
    const { modelType, rating, comment } = req.body;
    const guestUserId = new mongoose.Types.ObjectId('000000000000000000000000');
    const userId = req.user?.id || guestUserId;

    if (!['crop', 'yield', 'fertilizer', 'general'].includes(modelType)) {
      console.error('[REVIEW CONTROLLER] Invalid model type:', modelType);
      throw new Error('Invalid model type');
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      console.error('[REVIEW CONTROLLER] Invalid rating:', rating);
      throw new Error('Rating must be an integer between 1 and 5');
    }

    const review = new Review({
      userId,
      modelType,
      rating,
      comment
    });
    await review.save();
    console.log('[REVIEW CONTROLLER] Review saved:', review._id);

    res.status(201).json({ review });
  } catch (error) {
    console.error('[REVIEW CONTROLLER] Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const { modelType } = req.query;
    const query = modelType ? { modelType } : {};
    const reviews = await Review.find(query)
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .limit(50);
    console.log('[REVIEW CONTROLLER] Fetched reviews:', reviews.length);
    res.status(200).json({ reviews });
  } catch (error) {
    console.error('[REVIEW CONTROLLER] Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addReview, getReviews };

// // Version with authentication middleware
// const mongoose = require('mongoose');
// const Review = require('../models/review');
//
// const addReview = async (req, res) => {
//   try {
//     if (!req.user) {
//       throw new Error('Authentication required');
//     }
//     const { modelType, rating, comment } = req.body;
//     const userId = req.user.id;
//
//     if (!['crop', 'yield', 'fertilizer', 'general'].includes(modelType)) {
//       console.error('[REVIEW CONTROLLER] Invalid model type:', modelType);
//       throw new Error('Invalid model type');
//     }
//     if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
//       console.error('[REVIEW CONTROLLER] Invalid rating:', rating);
//       throw new Error('Rating must be an integer between 1 and 5');
//     }
//
//     const review = new Review({
//       userId,
//       modelType,
//       rating,
//       comment
//     });
//     await review.save();
//     console.log('[REVIEW CONTROLLER] Review saved:', review._id);
//
//     res.status(201).json({ review });
//   } catch (error) {
//     console.error('[REVIEW CONTROLLER] Error:', error.message);
//     res.status(400).json({ message: error.message });
//   }
// };
//
// const getReviews = async (req, res) => {
//   try {
//     const { modelType } = req.query;
//     const query = modelType ? { modelType } : {};
//     const reviews = await Review.find(query)
//       .populate('userId', 'username')
//       .sort({ createdAt: -1 })
//       .limit(50);
//     console.log('[REVIEW CONTROLLER] Fetched reviews:', reviews.length);
//     res.status(200).json({ reviews });
//   } catch (error) {
//     console.error('[REVIEW CONTROLLER] Error:', error.message);
//     res.status(400).json({ message: error.message });
//   }
// };
//
// module.exports = { addReview, getReviews };