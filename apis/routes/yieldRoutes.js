const express = require('express');
const { predictYieldEstimation } = require('../controllers/yieldController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


/**
 * @swagger
 * /api/yield/estimate:
 *   post:
 *     summary: Predict crop yield
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Year:
 *                 type: number
 *               average_rain_fall_mm_per_year:
 *                 type: number
 *               pesticides_tonnes:
 *                 type: number
 *               avg_temp:
 *                 type: number
 *               Area:
 *                 type: string
 *               Item:
 *                 type: string
 *     responses:
 *       200:
 *         description: Crop yield predicted successfully
 */
router.post('/estimate', predictYieldEstimation);

module.exports = router;