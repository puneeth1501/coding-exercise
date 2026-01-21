import Appointment from '../models/Appointment.js';

// Get all appointments for a user
export const getUserAppointments = async (req, res) => {
  try {
    // Validate if ID is a valid MongoDB ObjectId
    if (!req.params.userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const appointments = await Appointment.find({ user_id: req.params.userId }).sort({ datetime: 1 });
    res.json(appointments);
  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get current user's appointments
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user_id: req.user.id }).sort({ datetime: 1 });
    res.json(appointments);
  } catch (error) {
    console.error('Get my appointments error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Get single appointment
export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Create appointment
export const createAppointment = async (req, res) => {
  const { user_id, provider, datetime, repeat, end_date } = req.body;

  if (!user_id || !provider || !datetime) {
    return res.status(400).json({ error: 'User ID, provider, and datetime are required' });
  }

  try {
    const appointment = new Appointment({
      user_id,
      provider,
      datetime,
      repeat: repeat || null,
      end_date: end_date || null
    });

    await appointment.save();

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Update appointment
export const updateAppointment = async (req, res) => {
  const { provider, datetime, repeat, end_date } = req.body;

  if (!provider && !datetime && repeat === undefined && end_date === undefined) {
    return res.status(400).json({ error: 'At least one field must be provided' });
  }

  try {
    const updates = {};

    if (provider) updates.provider = provider;
    if (datetime) updates.datetime = datetime;
    if (repeat !== undefined) updates.repeat = repeat;
    if (end_date !== undefined) updates.end_date = end_date;

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete appointment
export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};
