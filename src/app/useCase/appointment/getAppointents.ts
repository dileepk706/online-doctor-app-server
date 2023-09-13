import { Appointment } from "../../../domain/entities/appointment/appointment";
import { slotes } from "../../../domain/entities/slote/slote";
import {AppointmentRepository} from "../../../infra/repositories/appointment/appointmentRepository";
import { AppError } from "../../../utils/error";


 

export const getAllAppointments_UseCase=(appointmentRepository:AppointmentRepository)=>
async(filter?:any,page?:number):Promise<Appointment[]>=>{
    
    const appointments=await appointmentRepository.getAllAppointments(filter,page)
    return appointments
}

export const getAppointmentsDahboard_UseCase=(appointmentRepository:AppointmentRepository)=>
async(filter?:any):Promise<any>=>{
    
    const appointments=await appointmentRepository.getAppointmentsDashboard()
    return appointments
}

export const patientsCountsAndRatioByDocId_Usecase=(appointmentRepository:AppointmentRepository)=>
async(doctorId:string):Promise<any>=>{
    const data=await appointmentRepository.getPateintsCountBy_M_F(doctorId)
    return data
}