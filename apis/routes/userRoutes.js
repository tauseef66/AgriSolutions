const express = require('express');
const { updateUserProfile, deleteUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all routes with authMiddleware
router.use(authMiddleware);

/**
 * @swagger
 * /api/user/update:
 *   put:
 *     summary: Update user profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */
router.put('/update', updateUserProfile);

/**
 * @swagger
 * /api/user/delete/{userId}:
 *   delete:
 *     summary: Delete user profile
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       204:
 *         description: User profile deleted successfully
 */
router.delete('/delete/:userId', deleteUserProfile);

module.exports = router;