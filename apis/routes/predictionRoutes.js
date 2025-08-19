const express = require('express');
const router = express.Router();
const { getUserPredictions,getAllPredictions } = require('../controllers/predictionController');
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

/**
 * @swagger
 * /api/predictions/all:
 *   get:
 *     summary: Get all predictions (admin)
 *     responses:
 *       200:
 *         description: All predictions fetched successfully
 */
router.get('/all', authMiddleware, getAllPredictions);

module.exports = router;