import { UserRepository } from "../../../infra/repositories/user/userRepository"
import { User } from "../../../domain/entities/user/userValidation"
import { createToken, userCreate } from "../../../domain/entities/user/userValidationHelper"
import { AppError } from "../../../utils/error"
import { UserReturnType } from "./userLogin"

export const signupSuer=(userRepository:UserRepository)=>{
    //return function for create new user 
    return async(user:User):Promise<UserReturnType>=>{
        const newUser:User=await userCreate(user)
        const isUserExist=await userRepository.findOneUserByEmail(user.email)        
        if(isUserExist)throw new AppError('Email is already taken',409)
        const createdUser=await userRepository.createUser(newUser)//this method will create a new user 
        const UserToken=createToken(createdUser)
        const createdUserWithToken:UserReturnType = {
            accessToken: UserToken,
            user:createdUser,
            message: 'User successfully signup',
        }
        return createdUserWithToken
    }
}   