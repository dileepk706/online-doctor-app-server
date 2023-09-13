import { Doctor } from "../../../domain/entities/doctor/doctor";
import { DoctorRepository } from "../../../infra/repositories/doctor/doctorRepository";


export const addReview_Usecase=(doctorRepository:DoctorRepository)=>
async (patient:string,doctor:string,review:string,rating:number):Promise<Doctor|undefined>=>{
    const doc= doctorRepository.addReviewAndRating(patient, doctor, review,rating )
    return doc
}


export const doctorCountsByDepartment_Usecae=(doctorRepository:DoctorRepository)=>
async ():Promise<any>=>{
    const doctorCountsByDepartment= doctorRepository.doctorCountByDepartment()
    return doctorCountsByDepartment
}