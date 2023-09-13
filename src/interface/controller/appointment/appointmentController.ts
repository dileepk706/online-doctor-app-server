import { Response } from "express";
import { getAppointments_UseCase } from "../../../app/useCase/appointment/createAppointment";
import { CustomRequest } from "../../middlewares/patientAuth";
import appointmentRepositoryIMPL from "../../../infra/repositories/appointment/appointmentRepository";
import { appointmentModel } from "../../../infra/database/model/appointment/appointment";
import { approveCancelation_UseCase, cancellAppointment_UseCase, updateAppointmentStautus_UseCase } from "../../../app/useCase/appointment/updateAppointment";
import { CustomRequestDoc } from "../../middlewares/doctorAuth";
import { getAllAppointments_UseCase } from "../../../app/useCase/appointment/getAppointents";
import moment from "moment";
import { AppError } from "../../../utils/error";
import { addWallet_Usecase } from "../../../app/useCase/user/userProfileUsecase";
import userRepositoryImpl from "../../../infra/repositories/user/userRepository";
import { userModel } from "../../../infra/database/model/patient/patient";
import { Appointment } from "../../../domain/entities/appointment/appointment";

const userRepository = userRepositoryImpl(userModel)
const appointmentRepository=appointmentRepositoryIMPL(appointmentModel)

export const getAppointmentsControllerPatient = async (req: CustomRequest, res: Response) => {

    try {
        const userId = req.user?.user?._id
        const appointments=await getAppointments_UseCase(appointmentRepository)(userId,undefined)
        
        res.status(200).json(appointments)
    } catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }

}
export const getAppointmentsControllerDoc = async (req: CustomRequestDoc, res: Response) => {

    try {
        const docId = req.doctor?.isDoctor?._id
        const appointments=await getAppointments_UseCase(appointmentRepository)(undefined,docId)
        
        res.status(200).json(appointments)
    } catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }

} 
export const consultedDoctors_Controller = async (req: CustomRequest, res: Response) => {

    try {
        const userId = req.user?.user?._id

        const appointments=await getAppointments_UseCase(appointmentRepository)(userId,undefined)
        
        res.status(200).json(appointments)
    } catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }

}

export const updateAppointStatus = async (req: CustomRequest, res: Response) => {
    try {    
     const userId=req.user?.user?._id
     const appointmentId=req.body.id
     const updatedAppointments=await updateAppointmentStautus_UseCase(appointmentRepository)(userId,appointmentId)
     res.status(200).json(updatedAppointments)
    } 
    catch (error:any) {
     console.log(error);
     
     res.status(error.statusCode || 500).json({message:error.message || 'Somthing went wrong'})
    }
 }

 export const getAllAppointmentController = async (req: CustomRequest, res: Response) => {
    try {    
    const filter=req.query.status
    const page=Number(req.query.page )
     const appointments=await getAllAppointments_UseCase(appointmentRepository)(filter,page)
     res.status(200).json(appointments)
    } 
    catch (error:any) {
     console.log(error);
     
     res.status(error.statusCode || 500).json({message:error.message || 'Somthing went wrong'})
    }
 }

 
 export const cancellAppointment = async (req: CustomRequest, res: Response) => {
    try { 
        const appointmentId=req.body.id as string   
        const cancelledAppointment=await cancellAppointment_UseCase(appointmentRepository)(appointmentId)
        res.status(200).json(cancelledAppointment)
    
    } 
    catch (error:any) {
     console.log(error);
     
     res.status(error.statusCode || 500).json({message:error.message || 'Somthing went wrong'})
    }
 }

 export const approveCancelation_controller = async (req: CustomRequest, res: Response) => {
    try { 
        const appointmentId=req.body.id as string   
        const cancelledAppointment:Appointment=await approveCancelation_UseCase(appointmentRepository)(appointmentId)
        const patientId=cancelledAppointment.user
        const wallet=cancelledAppointment.consultingFee
        const addWalletPateint=await addWallet_Usecase(userRepository)(patientId.toString(),wallet)
        res.status(200).json(cancelledAppointment)
    } 
    catch (error:any) {
     console.log(error);
     
     res.status(error.statusCode || 500).json({message:error.message || 'Somthing went wrong'})
    }
 }
 