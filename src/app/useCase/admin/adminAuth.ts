
import { adminLoginUserValidate, userLoginUserValidate } from "../../../domain/entities/user/userValidationHelper"
import bcrypt from "bcrypt"
import { DoctorRepository } from "../../../infra/repositories/doctor/doctorRepository"
import { AppError } from "../../../utils/error"
import jwt from 'jsonwebtoken';
import { Doctor } from "../../../domain/entities/doctor/doctor";
import { UserRepository } from "../../../infra/repositories/user/userRepository";
import { UserReturnType } from "../user/userLogin";
import { userLoginType } from "../../../interface/controller/user/userLoginController";

export type DoctorReturnType = {
    accessToken: string;
    doctor: {};
    message: string
}
export const adminAuth_Usecase = (userRepository: UserRepository) =>
 async (user: userLoginType): Promise<any> => {
    const isAdmin: userLoginType | null = await userRepository.findAdminByEmail(user.email)//check teh user is already exist 
    if(!isAdmin){
        throw new AppError('You are not a admin', 404)
    }

    const adminToken = await adminLoginUserValidate(user, isAdmin)//validate the user credentials 
    const verifiedUser = {
        accessToken: adminToken,
        admin:isAdmin,
        message: 'Login success',
    }
    return verifiedUser

    }
