import { Request, Response } from "express";
import { userModel } from "../../../infra/database/model/patient/patient";
import userRepositoryImpl from "../../../infra/repositories/user/userRepository";
import { loginUser, loginWithGoogle_Uecase } from "../../../app/useCase/user/userLogin";
import { ObjectId } from "mongoose";
import { User } from "../../../domain/entities/user/userValidation";
const db = userModel //Instantiate MongoDB connection 
const userRepository = userRepositoryImpl(db)

export type userLoginType={
    email:string;
    password:string
}

export const userLogin = async (req: Request, res: Response) => {
   try {
      const user: User = req.body
      //userRepository contains all dbOperations of user collection
      //login accept the userRepository as parameter and  return another function to login the user
      const userToken=await  loginUser(userRepository)(user)
      res.status(200).json(userToken)
   } catch (error:any) {
      console.log(error.message);

      res.status(error.statusCode || 500).json({message:error.message || 'Somthing went wrong'})
   }
}
export const loginWithGoogle_Controller= async (req: Request, res: Response) => {
   try{
      const name = req.body.name as string
      const email = req.body.email as string
      const image = req.body.picture as string
      const userToken=await  loginWithGoogle_Uecase(userRepository)(email,name,image)
      res.status(200).json(userToken)
   }catch (error:any) {
      
      res.status(error.statusCode || 500).json({message:error.message || 'Somthing went wrong'})
   }
}
