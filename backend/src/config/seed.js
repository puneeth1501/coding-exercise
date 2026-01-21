import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import Medication from '../models/Medication.js';
import Dosage from '../models/Dosage.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://anantha:Puneeth1501@cluster0.qtcwnmz.mongodb.net/mini-emr?retryWrites=true&w=majority';

const seedData = {
  users: [
    {
      name: "Mark Johnson",
      email: "mark@some-email-provider.net",
      password: "Password123!",
      appointments: [
        {
          provider: "Dr Kim West",
          datetime: "2025-09-16T16:30:00.000-07:00",
          repeat: "weekly"
        },
        {
          provider: "Dr Lin James",
          datetime: "2025-09-19T18:30:00.000-07:00",
          repeat: "monthly"
        }
      ],
      prescriptions: [
        {
          medication: "Lexapro",
          dosage: "5mg",
          quantity: 2,
          refill_on: "2025-10-05",
          refill_schedule: "monthly"
        },
        {
          medication: "Ozempic",
          dosage: "1mg",
          quantity: 1,
          refill_on: "2025-10-10",
          refill_schedule: "monthly"
        }
      ]
    },
    {
      name: "Lisa Smith",
      email: "lisa@some-email-provider.net",
      password: "Password123!",
      appointments: [
        {
          provider: "Dr Sally Field",
          datetime: "2025-09-22T18:15:00.000-07:00",
          repeat: "monthly"
        },
        {
          provider: "Dr Lin James",
          datetime: "2025-09-25T20:00:00.000-07:00",
          repeat: "weekly"
        }
      ],
      prescriptions: [
        {
          medication: "Metformin",
          dosage: "500mg",
          quantity: 2,
          refill_on: "2025-10-15",
          refill_schedule: "monthly"
        },
        {
          medication: "Diovan",
          dosage: "100mg",
          quantity: 1,
          refill_on: "2025-10-25",
          refill_schedule: "monthly"
        }
      ]
    }
  ],
  medications: ["Diovan", "Lexapro", "Metformin", "Ozempic", "Prozac", "Seroquel", "Tegretol"],
  dosages: ["1mg", "2mg", "3mg", "5mg", "10mg", "25mg", "50mg", "100mg", "250mg", "500mg", "1000mg"]
};

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Appointment.deleteMany({});
    await Prescription.deleteMany({});
    await Medication.deleteMany({});
    await Dosage.deleteMany({});

    console.log('Seeding medications...');
    for (const medication of seedData.medications) {
      await Medication.create({ name: medication });
    }
    console.log('Medications seeded');

    console.log('Seeding dosages...');
    for (const dosage of seedData.dosages) {
      await Dosage.create({ value: dosage });
    }
    console.log('Dosages seeded');

    console.log('Seeding users with appointments and prescriptions...');
    for (const userData of seedData.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      });

      console.log(`User ${user.name} created with ID: ${user._id}`);

      // Create appointments
      for (const appointmentData of userData.appointments) {
        await Appointment.create({
          user_id: user._id,
          provider: appointmentData.provider,
          datetime: appointmentData.datetime,
          repeat: appointmentData.repeat
        });
      }
      console.log(`Appointments created for ${user.name}`);

      // Create prescriptions
      for (const prescriptionData of userData.prescriptions) {
        await Prescription.create({
          user_id: user._id,
          medication: prescriptionData.medication,
          dosage: prescriptionData.dosage,
          quantity: prescriptionData.quantity,
          refill_on: prescriptionData.refill_on,
          refill_schedule: prescriptionData.refill_schedule
        });
      }
      console.log(`Prescriptions created for ${user.name}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
