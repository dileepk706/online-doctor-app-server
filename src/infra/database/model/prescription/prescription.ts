import mongoose, { Document, Model, Schema } from 'mongoose';
import { Prescription } from '../../../../domain/entities/prescription/prescription';

export type MongoDBPrescription = Model<Document<any, any, any> & Prescription>;

// Define the schema for the doctor collection
const prescriptionSchema = new Schema<Prescription>({
  doctor: { type: Schema.Types.ObjectId, ref: 'doctor', required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  date: { type: String, required: true },
  prescriptionNumber:{ type: String, required: true },
  medicines: {
    type: [{
      medicineName: { type: String, required: true },
      purpose: { type: String, required: true },
      dosage: { type: String, required: true },
      frequency: { type: String, required: true },
    }]
  },
},
{
  timestamps: { createdAt: true }
});

export const PrescriptionModel: MongoDBPrescription = mongoose.connection.model<Document<any, any, any> & Prescription>('prescription', prescriptionSchema);
