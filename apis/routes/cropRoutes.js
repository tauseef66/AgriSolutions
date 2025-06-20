const express = require('express');
const { predictCropRecommendation } = require('../controllers/cropController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all routes with authMiddleware
// router.use(authMiddleware);

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
router.post('/recommend', predictCropRecommendation);

module.exports = router;