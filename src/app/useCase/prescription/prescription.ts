import { generateRandomString } from "../../../domain/entities/doctor/doctorValidateHelper";
import { Medicine, Prescription } from "../../../domain/entities/prescription/prescription"
import { PrescriptionRepository } from "../../../infra/repositories/prescription/prescriptionRepository"
import moment from 'moment';

export const createPrescription_Usecase=(PrescriptionRepository:PrescriptionRepository)=>
async(doctor:string,patient:string,medicines:Medicine[]):Promise<Prescription>=>{
    const date:string= moment().format('YYYY-MM-DD'); 
    const prescriptionNumber=`PRE000${generateRandomString(6)}`
    const newPrescription=await PrescriptionRepository.createPrescription(doctor,patient,medicines,date,prescriptionNumber)
    return newPrescription
}

export const getPrescription_Usecase=(PrescriptionRepository:PrescriptionRepository)=>
async(doctor:string,patient:string):Promise<Prescription[]>=>{
    const newPrescription=await PrescriptionRepository.getPrescriptionsOnepatient(doctor,patient)
    return newPrescription
}
export const getOnePatientPrescription_Usecase=(PrescriptionRepository:PrescriptionRepository)=>
async(patient:string):Promise<Prescription[]>=>{
    const newPrescription=await PrescriptionRepository.getAllPrescriptionsOnepatient(patient)
    return newPrescription
}