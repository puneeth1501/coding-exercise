import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const Medication = mongoose.model('Medication', medicationSchema);

export default Medication;
