import { ObjectId } from "mongoose";
import { slotes } from "../slote/slote";

export interface Appointment{
    _id:string;
    user:ObjectId;
    doctor:ObjectId;
    isConsulted:boolean;
    status:'consulted'|'cancelled'|'notConsulted'|'cancellation-requested';
    scheduledAt:slotes
    paymentStatus:'pending' | 'success';
    consultingFee:number;
}
 