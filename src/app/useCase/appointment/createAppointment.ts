import { Appointment } from "../../../domain/entities/appointment/appointment";
import { slotes } from "../../../domain/entities/slote/slote";
import {AppointmentRepository} from "../../../infra/repositories/appointment/appointmentRepository";
import { AppError } from "../../../utils/error";


export const createAppointment_UseCase=(appointmentRepository:AppointmentRepository)=>
async(slot:slotes,doctor:string,user:string,price:number):Promise<Appointment>=>{
    if(!slot){
        throw new AppError('Somthing went wrong',500)
    }
    const appointment=await appointmentRepository.createAppointment(slot,doctor,user,price)
    return appointment
}

export const getAppointments_UseCase=(appointmentRepository:AppointmentRepository)=>
async(user?:string,doc?:string):Promise<Appointment[]>=>{
    
    const appointments=await appointmentRepository.getAppointments(doc,user)
    return appointments
}