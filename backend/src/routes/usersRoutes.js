import express from 'express';
import {
  getAllUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  getMedications,
  getDosages
} from '../controllers/usersController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/medications', getMedications);
router.get('/dosages', getDosages);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

// Admin routes (no auth required per requirements)
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);

export default router;
