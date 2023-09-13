import { Request, Response } from "express";
import { userModel } from "../../../infra/database/model/patient/patient";
import userRepositoryImpl from "../../../infra/repositories/user/userRepository";
import { User } from "../../../domain/entities/user/userValidation";
import { CustomRequest } from "../../middlewares/patientAuth";
import { patientsCountsAndRatio_Usecase, userProfileUpdate_Usecase, userProfile_Usecase } from "../../../app/useCase/user/userProfileUsecase";
import { doctorCountsByDepartment_Usecae } from "../../../app/useCase/doctor/reviewUseCase";
import doctorRepositoryIMPL from "../../../infra/repositories/doctor/doctorRepository";
import { doctorModel } from "../../../infra/database/model/doctor/doctor";
import { getAppointmentsDahboard_UseCase } from "../../../app/useCase/appointment/getAppointents";
import appointmentRepositoryIMPL from "../../../infra/repositories/appointment/appointmentRepository";
import { appointmentModel } from "../../../infra/database/model/appointment/appointment";

const db = userModel //Instantiate MongoDB connection 
const userRepository = userRepositoryImpl(db)

const appointmentRepository=appointmentRepositoryIMPL(appointmentModel)

const doctorRepository = doctorRepositoryIMPL(doctorModel)

export const getUerPofile = async (req: CustomRequest, res: Response) => {
   try 
   {    
    let userId=req.user?.user?._id
    if(!userId){
        userId=req.params.id
    }
    const user=await  userProfile_Usecase(userRepository)(userId)
    if(!user){  
        res.status(500).json({message:'Somthing went wrong'})
        return
    }
    res.status(200).json(user)
   } 
   catch (error:any) {
    console.log(error);
    
    res.status(error.statusCode || 500).json({message:error.message || 'Somthing went wrong'})
   }
}
export const updateUerPofile = async (req: CustomRequest, res: Response) => {
    try {    
     const userId=req.user?.user?._id
     const {name,email,age,phone,sex}=req.body

     const user=await  userProfileUpdate_Usecase(userRepository)(userId,name,email,age,phone,sex)
     res.status(200).json(user)
      
    } 
    catch (error:any) {
     console.log(error);
     
     res.status(error.statusCode || 500).json({message:error.message || 'Somthing went wrong'})
    }
 }

 export const patientsCountsAndRatioController = async (req: Request, res: Response) => {

    try {
       
       const patientCountData=await patientsCountsAndRatio_Usecase(userRepository)(  )
       const doctorCountsByDepartment=await doctorCountsByDepartment_Usecae(doctorRepository)()
       const data=await getAppointmentsDahboard_UseCase(appointmentRepository)()
       const [appointmentDahboard,revenue]=data
       res.status(200).json({patientCountData,doctorCountsByDepartment,appointmentDahboard,revenue})
    } catch (error: any) {  
       console.log(error);
       res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }
 
 }