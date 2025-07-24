const express = require('express');
const router = express.Router();
const { predictYieldRecommendation } = require('../controllers/yieldController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/yield/predict:
 *   post:
 *     summary: Predict crop yield
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               N:
 *                 type: number
 *               P:
 *                 type: number
 *               K:
 *                 type: number
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               rainfall:
 *                 type: number
 *               area:
 *                 type: number
 *     responses:
 *       200:
 *         description: Crop yield predicted successfully
 */
router.post('/predict', authMiddleware, predictYieldRecommendation);

module.exports = router;