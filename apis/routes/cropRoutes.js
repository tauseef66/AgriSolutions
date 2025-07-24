const express = require('express');
const router = express.Router();
const { predictCropRecommendation } = require('../controllers/cropController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/crop/recommend:
 *   post:
 *     summary: Predict crop recommendation
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
 *               ph:
 *                 type: number
 *               rainfall:
 *                 type: number
 *     responses:
 *       200:
 *         description: Crop recommendation predicted successfully
 */
router.post('/recommend', authMiddleware, predictCropRecommendation);

module.exports = router;