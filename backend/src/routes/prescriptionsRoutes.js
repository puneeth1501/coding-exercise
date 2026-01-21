import express from 'express';
import {
  getUserPrescriptions,
  getMyPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription
} from '../controllers/prescriptionsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes for patients
router.get('/my-prescriptions', authenticateToken, getMyPrescriptions);

// Admin routes (no auth required per requirements)
router.get('/user/:userId', getUserPrescriptions);
router.get('/:id', getPrescriptionById);
router.post('/', createPrescription);
router.put('/:id', updatePrescription);
router.delete('/:id', deletePrescription);

export default router;
