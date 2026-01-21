import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  datetime: {
    type: String,
    required: true
  },
  repeat: {
    type: String,
    default: null
  },
  end_date: {
    type: String,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
