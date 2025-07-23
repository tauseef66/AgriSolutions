const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/reviewController');

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Add a review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modelType:
 *                 type: string
 *                 enum: [crop, yield, fertilizer, general]
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *   get:
 *     summary: Get reviews
 *     parameters:
 *       - in: query
 *         name: modelType
 *         schema:
 *           type: string
 *           enum: [crop, yield, fertilizer, general]
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 */
router.post('/', addReview);
router.get('/', getReviews);

module.exports = router;

// // Version with authentication middleware
// const express = require('express');
// const router = express.Router();
// const { addReview, getReviews } = require('../controllers/reviewController');
// const authMiddleware = require('../middleware/auth');
//
// /**
//  * @swagger
//  * /api/reviews:
//  *   post:
//  *     summary: Add a review
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               modelType:
//  *                 type: string
//  *                 enum: [crop, yield, fertilizer, general]
//  *               rating:
//  *                 type: integer
//  *                 minimum: 1
//  *                 maximum: 5
//  *               comment:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Review added successfully
//  *   get:
//  *     summary: Get reviews
//  *     parameters:
//  *       - in: query
//  *         name: modelType
//  *         schema:
//  *           type: string
//  *           enum: [crop, yield, fertilizer, general]
//  *     responses:
//  *       200:
//  *         description: Reviews fetched successfully
//  */
// router.post('/', authMiddleware, addReview);
// router.get('/', getReviews);
//
// module.exports = router;