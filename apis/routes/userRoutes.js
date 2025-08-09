const express = require('express');
const { getUserDetails, updateUserProfile, deleteUserProfile, getAllUsersDetails } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get authenticated user details
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/', getUserDetails);

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

/**
 * @swagger
 * /api/user/all:
 *   get:
 *     summary: Get all users' details
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/all', getAllUsersDetails);


module.exports = router;