import moment from "moment";
import { Appointment } from "../../../domain/entities/appointment/appointment";
import { slotes } from "../../../domain/entities/slote/slote";
import { AppointmentRepository } from "../../../infra/repositories/appointment/appointmentRepository";
import { AppError } from "../../../utils/error";




export const updateAppointmentStautus_UseCase = (appointmentRepository: AppointmentRepository) =>
    async (user: string, appointmentId: string): Promise<Appointment[]> => {

        const appointments = await appointmentRepository.updateAppointmentStautus(user, appointmentId)
        return appointments
    }

export const cancellAppointment_UseCase = (appointmentRepository: AppointmentRepository) =>
    async (id: string): Promise<any> => {

        const appointment = await appointmentRepository.getAppointmentById(id)
        const date = appointment.scheduledAt.slot_date
        const slotDate = moment(date);
        const currentDate = new Date();

        if(appointment.status==='consulted'){
            throw new AppError('Your already took this consultaion ', 400);
        }
        if (slotDate.toDate() <= currentDate) {
            throw new AppError('Your cancellation has rejected due to expired appointment', 400);
        }
        const cancelledAppointent=await appointmentRepository.cancellAppoint(id)
        return cancelledAppointent
    }

    export const approveCancelation_UseCase = (appointmentRepository: AppointmentRepository) =>
    async (id: string): Promise<any> => {

        const appointment = await appointmentRepository.approveCancelation(id)
        
        return appointment
    }