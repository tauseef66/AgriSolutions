
const express = require('express');
const { predictFertilizerRecommendation } = require('../controllers/fertilizerController');

const router = express.Router();

/**
 * @swagger
 * /api/fertilizer/recommend:
 *   post:
 *     summary: Predict fertilizer recommendation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Temperature:
 *                 type: number
 *               Moisture:
 *                 type: number
 *               Rainfall:
 *                 type: number
 *               PH:
 *                 type: number
 *               Nitrogen:
 *                 type: number
 *               Phosphorous:
 *                 type: number
 *               Potassium:
 *                 type: number
 *               Carbon:
 *                 type: number
 *               Soil:
 *                 type: string
 *               Crop:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fertilizer recommendation predicted successfully
 */
router.post('/fertilizer', predictFertilizerRecommendation);

module.exports = router;
