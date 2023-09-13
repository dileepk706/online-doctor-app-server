import { User } from "../../../domain/entities/user/userValidation"
import { UserRepository } from "../../../infra/repositories/user/userRepository"
import { AppError } from "../../../utils/error"

export const userProfile_Usecase=(userRepository:UserRepository)=>
async(userId:string):Promise<User|null>=>{
   const user=await userRepository.findUserById(userId)
   return user
}

export const userProfileUpdate_Usecase=(userRepository:UserRepository)=>
async(userId:string,name:string, email:string,age:string,phone:string,sex:string)=>{
   const User =await userRepository.findOneUserByEmail(email)
   
   const UserId=User?._id.toString()
   console.log(userId);
   if (User && UserId !== userId) {
      throw new AppError('Email is already exist', 409);
    }
   const user=await userRepository.updateUserById(userId,name,email,age,phone,sex)
   return user
}

export const patientsCountsAndRatio_Usecase=(userRepository:UserRepository)=>
async():Promise<any>=>{
    const data=await userRepository.PatientsCount()
    return data
}


export const addWallet_Usecase=(userRepository:UserRepository)=>
async(id:string,wallet:number):Promise<any>=>{
    const data=await userRepository.addWallet(id,wallet)
    return data
}