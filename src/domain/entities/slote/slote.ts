import { ObjectId } from "mongoose";

export interface Slot{
    _id:string
    doctor:ObjectId;
    slotes:slotes[]
    created_at: string
}
export type slotes={
    _id?:string
    slot_time: string;
    slot_date: string;
    date:string
    isBooked?:boolean
}