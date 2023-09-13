import { ObjectId } from "mongoose";

export interface Prescription {
    doctor: ObjectId;
    patient: ObjectId;
    medicines:Medicine[]
    date: string;
    prescriptionNumber?: string;
  }
  export interface Medicine{
    medicineName: string;
    purpose: string;
    dosage: string;
    frequency: string;
  }