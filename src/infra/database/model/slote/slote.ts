import mongoose, { Document, Model, Schema } from 'mongoose';
import { Slot } from '../../../../domain/entities/slote/slote';

export type MongoDBSlot = Model<Document<any, any, any> & Slot>;

// Define the schema for the doctor collection
const SlotSchema = new Schema<Slot>({
    doctor: { type: Schema.Types.ObjectId, ref: 'doctor' },
    slotes: {
        type: [{
            slot_time: {
                type: String,
                required: true,
            },
            date:{
                type:Date
            },
            slot_date: {
                type: String,
                required: true,
            },
            isBooked: {
                type: Boolean,
                required: true,
                default:false
            },
        }],
    },

}, {
    timestamps: { createdAt: true }
});

export const slotModel: MongoDBSlot = mongoose.connection.model<Document<any, any, any> & Slot>('slot', SlotSchema);