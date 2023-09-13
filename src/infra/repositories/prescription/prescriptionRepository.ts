import { Medicine, Prescription } from "../../../domain/entities/prescription/prescription"
import { AppError } from "../../../utils/error"
import { MongoDBPrescription } from "../../database/model/prescription/prescription"

export type PrescriptionRepository={
    createPrescription:(doctor:string,patient:string,medicines:Medicine[],date:string,prescriptionNumber:string)=>Promise<Prescription>
    getPrescriptionsOnepatient:(doctor:string,patient:string)=>Promise<Prescription[]>
    getAllPrescriptionsOnepatient:(patient:string)=>Promise<Prescription[]>


}
const prescriptionRepositoryIMPL=(PrescriptionModel:MongoDBPrescription):PrescriptionRepository=>{

    const createPrescription=async(doctor:string,patient:string,medicines:Medicine[],date:string,prescriptionNumber:string):Promise<Prescription>=>{

        const newPrescription=new PrescriptionModel({
            doctor,
            patient,
            medicines,
            date,
            prescriptionNumber
        })
        const createdPrescription:Prescription=await newPrescription.save()
        if(!createdPrescription)throw new AppError('Somthing went wrong when creating the prescription',500)
        return createdPrescription

    }

    const getPrescriptionsOnepatient=async(doctor:string,patient:string):Promise<Prescription[]>=>{
        const prescritions:Prescription[]=await PrescriptionModel.find({doctor,patient})
        .populate({
            path: 'doctor',
            populate: {
              path: 'department',
            },
          })
        .populate('patient')
        .sort({createdAt:-1})
        return prescritions
    }
    const getAllPrescriptionsOnepatient=async(patient:string):Promise<Prescription[]>=>{
        const prescritions:Prescription[]=await PrescriptionModel.find({patient})
        .populate({
            path: 'doctor',
            populate: {
              path: 'department',
            },
          })
        .populate('patient')
        .sort({createdAt:-1})
        return prescritions
    }
    return{
        createPrescription,getPrescriptionsOnepatient,getAllPrescriptionsOnepatient
    }
}

export default prescriptionRepositoryIMPL