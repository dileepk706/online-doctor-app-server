import mongoose, { Document, Model, Schema } from 'mongoose';
import { Appointment } from '../../../../domain/entities/appointment/appointment';

export type MongoDBAppointment = Model<Document<any, any, any> & Appointment>;


const AppointmentSchema = new Schema<Appointment>({
    doctor: { type: Schema.Types.ObjectId, ref: 'doctor' },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    scheduledAt: {
        slot_time: { type: String, required: true },
        slot_date: { type: String, required: true },
        date: { type: String, required: true },
        isBooked: { type: Boolean, default: true }
    },
    consultingFee:{type:Number,required: true},
    isConsulted:{type:Boolean,required: true,default:false},
    paymentStatus: {
        type: String,
        enum:['pending' , 'success'],
    },
    status:{
        type:String,
        enum:['consulted','cancelled','notConsulted','cancellation-requested'],
        default:'notConsulted'
    },
}, {
    timestamps: { createdAt: true }
});

export const appointmentModel: MongoDBAppointment = mongoose.connection.model<Document<any, any, any> & Appointment>('appointment', AppointmentSchema);