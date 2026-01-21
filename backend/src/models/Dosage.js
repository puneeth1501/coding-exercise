import mongoose from 'mongoose';

const dosageSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true
  }
});

const Dosage = mongoose.model('Dosage', dosageSchema);

export default Dosage;
