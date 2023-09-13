import { Request, Response } from "express";
import {CustomRequest} from "../../middlewares/patientAuth"
import sloteRepositoryImpl from "../../../infra/repositories/slotes/slotRepository";
import { slotModel } from "../../../infra/database/model/slote/slote";
import { createSlot_Usecase } from "../../../app/useCase/slote/createSlotUsecase";
import moment from "moment";
import { AppError } from "../../../utils/error";
import { getBookedSlote_Usecase, getSlots_Usecase } from "../../../app/useCase/slote/getSlotes";
import { Slot, slotes } from "../../../domain/entities/slote/slote";
import appointmentRepositoryIMPL from "../../../infra/repositories/appointment/appointmentRepository";
import { appointmentModel } from "../../../infra/database/model/appointment/appointment";
import { createAppointment_UseCase, getAppointments_UseCase } from "../../../app/useCase/appointment/createAppointment";
import { CustomRequestDoc } from "../../middlewares/doctorAuth";

const appointmentRepository=appointmentRepositoryIMPL(appointmentModel)
const sloteRepository = sloteRepositoryImpl(slotModel)

export const createSloteController = async (req: CustomRequestDoc, res: Response) => {
    try {
        let token=req.headers.accesstoken
        
        const doctor=req.doctor?.isDoctor?._id
        const date = req.body.slotDate as string
        const startTime = req.body.startTime as string
        const endTime = req.body.endTime as string
        const slotDuration = req.body.slotDuration as number
        const startingTime = moment(startTime, 'h:mm A');

        const currentDate = new Date();
        const slotDate = moment(date);
        const endingTime = moment(endTime, 'h:mm A');

        if(!date || !startTime || !endTime || !slotDuration){
            throw new AppError('All fields are required',400)
        }
        //validate is slot date greater than curent date date
        if (slotDate.toDate() <= currentDate) {  
            throw new AppError('Slot date must be in the future', 400);
        }

        //validate is ending time greater than starting time
        const expectedEndingTime = startingTime.clone().add(slotDuration, 'minutes');
        if (endingTime.isSameOrBefore(expectedEndingTime)) {
            throw new AppError('Ending time must be greater than starting time plus slot duration', 400);
        }
        if (endingTime.isBefore(startingTime)) {
            throw new AppError('Ending time cannot be less than starting time', 400);
        }

        
        const newSlote = await createSlot_Usecase(sloteRepository)(doctor, date, startTime, endTime, slotDuration)
        res.send(newSlote)
    } catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }
}

export const getSlotesController=async(req:Request,res:Response)=>{

    try {
     const doctorId=req.params.id as string
     const slots:slotes[]|undefined=await getSlots_Usecase(sloteRepository)(doctorId)
     
     res.status(200).json(slots)
    } catch (error:any) {
     console.log(error);
     res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }
 
 } 
export const bookSloteController = async (req: CustomRequest, res: Response) => {

    try {
        const userId = req.user?.user?._id
        const doctorId = req.body.doctorId
        const slotId = req.body.slotId
        const consultingFee = req.body.consultingFee as number
        const bookedSlote: slotes | undefined = await getBookedSlote_Usecase(sloteRepository)(doctorId, slotId)
        if (!bookedSlote) {
            throw new AppError('Somthing went wrong while booking slote', 500)
        }
        const appointment = await createAppointment_UseCase(appointmentRepository)(bookedSlote, doctorId, userId, consultingFee)
        if(!appointment){
            throw new AppError('Somthing went wrong while booking slote', 500)
        }
        console.log('slotye  : ', appointment);

        res.status(200).json({ messag: 'Appointment created' })
    } catch (error: any) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }

} 

