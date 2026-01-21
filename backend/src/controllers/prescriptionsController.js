import Prescription from '../models/Prescription.js';

// Get all prescriptions for a user
export const getUserPrescriptions = async (req, res) => {
  try {
    // Validate if ID is a valid MongoDB ObjectId
    if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const prescriptions = await Prescription.find({ user_id: req.params.userId }).sort({ refill_on: 1 });
    res.json(prescriptions);
  } catch (error) {
    console.error('Get user prescriptions error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get current user's prescriptions
export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user_id: req.user.id }).sort({ refill_on: 1 });
    res.json(prescriptions);
  } catch (error) {
    console.error('Get my prescriptions error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get single prescription
export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    console.error('Get prescription by ID error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Create prescription
export const createPrescription = async (req, res) => {
  const { user_id, medication, dosage, quantity, refill_on, refill_schedule } = req.body;

  if (!user_id || !medication || !dosage || !quantity || !refill_on || !refill_schedule) {
    return res.status(400).json({
      error: 'User ID, medication, dosage, quantity, refill_on, and refill_schedule are required'
    });
  }

  try {
    const prescription = new Prescription({
      user_id,
      medication,
      dosage,
      quantity,
      refill_on,
      refill_schedule
    });

    await prescription.save();

    res.status(201).json(prescription);
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update prescription
export const updatePrescription = async (req, res) => {
  const { medication, dosage, quantity, refill_on, refill_schedule } = req.body;

  if (!medication && !dosage && !quantity && !refill_on && !refill_schedule) {
    return res.status(400).json({ error: 'At least one field must be provided' });
  }

  try {
    const updates = {};

    if (medication) updates.medication = medication;
    if (dosage) updates.dosage = dosage;
    if (quantity) updates.quantity = quantity;
    if (refill_on) updates.refill_on = refill_on;
    if (refill_schedule) updates.refill_schedule = refill_schedule;

    const prescription = await Prescription.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.json({ message: 'Prescription updated successfully' });
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete prescription
export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};
