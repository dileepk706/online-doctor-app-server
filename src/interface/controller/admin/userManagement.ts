import { Request, Response } from "express";
import { userModel } from "../../../infra/database/model/patient/patient";
import userRepositoryImpl from "../../../infra/repositories/user/userRepository";
import { getUsers } from "../../../app/useCase/admin/patients/getAllUsers";
import { AppError } from "../../../utils/error";
import { blockOneUser } from "../../../app/useCase/admin/patients/block-unblockUser";
import { searchUserUsecase, sortUserUsecase } from "../../../app/useCase/admin/patients/searchSortFilter";
import { patientsCountsAndRatio_Usecase } from "../../../app/useCase/user/userProfileUsecase";
import { doctorCountsByDepartment_Usecae } from "../../../app/useCase/doctor/reviewUseCase";
import { getAppointmentsDahboard_UseCase } from "../../../app/useCase/appointment/getAppointents";
import appointmentRepositoryIMPL from "../../../infra/repositories/appointment/appointmentRepository";
import { appointmentModel } from "../../../infra/database/model/appointment/appointment";
import { doctorModel } from "../../../infra/database/model/doctor/doctor";
import doctorRepositoryIMPL from "../../../infra/repositories/doctor/doctorRepository";
import { adminAuth_Usecase } from "../../../app/useCase/admin/adminAuth";
import { User } from "../../../domain/entities/user/userValidation";

const db=userModel //mogo db userModel
const userRepository=userRepositoryImpl(db)// return mongodb methods related to user collection

const appointmentRepository=appointmentRepositoryIMPL(appointmentModel)
const doctorRepository = doctorRepositoryIMPL(doctorModel)
//get all users
export const getAllUserController = async (req: Request, res: Response) => {
    try {
        const allUsers=await getUsers(userRepository)()
        if(!allUsers)throw new AppError('Somthing went wrong while fetch the users',500)
        res.status(200).json({ users: allUsers })
    }       
    catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }
}
//block and unblock the user
export const blockOrUnblockUserController = async (req: Request, res: Response) => {
    try {
        const userId:string | undefined=req.query.id as string
        const action:string | undefined=req.query.action as string
        if(!userId || !action)throw new AppError('Not found',404)
        console.log({userId,action})
    //call the blockOneUser function with db operation and it will retur asyn func with two params for block the user
        const blockedPatiant=await blockOneUser(userRepository)(userId,action)
        if(blockedPatiant===null)throw new AppError('Somthing went wrong while fetch the users',500)
        if(blockedPatiant===true){
            res.status(200).json({ message: 'User blocked succesfully' })
            return
        }else if(blockedPatiant===false){
            res.status(200).json({ message: 'User unblocked succesfully' })
            return
        }
    }
    catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }
}
//sort the user data with diffriend conditions
export const sortUserController =async(req: Request, res: Response) => {
    try {
        const sortCriteria:object=req.query
        const sortedUser=await sortUserUsecase(userRepository)(sortCriteria)
        res.status(200).json(sortedUser)
    }
    catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }
}

//sort the user data with diffriend conditions
export const searchUserController=async(req: Request, res: Response) => {
    try {
        const searchQuery=req.query.q as string
        const sort=req.query.sort
        let sortCriteria:object={}
        if(sort==='name-1')sortCriteria={name:1}
        else if(sort==='name1')sortCriteria={name:-1}
        else if(sort==='age-1')sortCriteria={dob:-1}
        else if(sort==='age1')sortCriteria={dob:1}
        else sortCriteria={}
        const searchResult=await searchUserUsecase(userRepository)(searchQuery,sortCriteria)
        res.status(200).json(searchResult)
    }
    catch (error: any) {
        console.log(error)
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
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
 

export const adminLogin_Controller = async (req: Request, res: Response) => {
    try {
     
        const admin: User = req.body
      //userRepository contains all dbOperations of user collection
      //login accept the userRepository as parameter and  return another function to login the user
      const userToken=await  adminAuth_Usecase(userRepository)(admin)
      res.status(200).json(userToken)
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })

    }

}