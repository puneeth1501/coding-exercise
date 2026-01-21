import express from 'express';
import {
  getUserAppointments,
  getMyAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes for patients
router.get('/my-appointments', authenticateToken, getMyAppointments);

// Admin routes (no auth required per requirements)
router.get('/user/:userId', getUserAppointments);
router.get('/:id', getAppointmentById);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
