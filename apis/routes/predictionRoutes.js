const express = require('express');
const router = express.Router();
const { getUserPredictions } = require('../controllers/predictionController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/predictions:
 *   get:
 *     summary: Get user predictions
 *     responses:
 *       200:
 *         description: Predictions fetched successfully
 */
router.get('/', authMiddleware, getUserPredictions);

module.exports = router;