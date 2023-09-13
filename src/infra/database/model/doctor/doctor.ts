import mongoose, { Document, Model, Schema } from 'mongoose';
import { Doctor } from '../../../../domain/entities/doctor/doctor';

export type MongoDBDoctor = Model<Document<any, any, any> & Doctor>;

// Define the schema for the doctor collection
const doctorSchema = new Schema<Doctor>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  isMailVarified: { type: Boolean, default: false },
  phone: { type: String, trim: true },
  image: { type: String, trim: true, default: null },
  address: {
    houseNo: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  dob: String,
  isBlocked: { type: Boolean, default: false },
  sex: { type: String, enum: ['male', 'female'], trim: true },
  designation: { type: String, trim: true },
  department: { type: Schema.Types.ObjectId, ref: 'department' },
  yearOfExperiance: { type:Number },
  biography: { type: String, trim: true },
  consultingFee: { type: Number },
  rating: { type: Number, default: 1 },
  reviews: [
    {
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user',
      },
    },
    {
      timestamps: true,
    }
  ]
}, {
  timestamps: { createdAt: true }
});

export const doctorModel: MongoDBDoctor = mongoose.connection.model<Document<any, any, any> & Doctor>('doctor', doctorSchema);