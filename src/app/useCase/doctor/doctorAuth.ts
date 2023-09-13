import { userLoginUserValidate } from "../../../domain/entities/user/userValidationHelper"
import bcrypt from "bcrypt"
import { DoctorRepository } from "../../../infra/repositories/doctor/doctorRepository"
import { AppError } from "../../../utils/error"
import jwt from 'jsonwebtoken';
import { Doctor } from "../../../domain/entities/doctor/doctor";

export type DoctorReturnType = {
    accessToken: string;
    doctor: {};
    message: string
}
export const doctorAuth_Usecase = (doctorRepository: DoctorRepository) =>
    async (email: string, password: string) => {
        const isDoctorExist: Doctor | null = await doctorRepository.findDoctorByEmail(email)//check teh user is already exist 
        if (!isDoctorExist) throw new AppError('Doctor is not exist', 404)
        const isDoctorBlocked = await doctorRepository.isDoctorBlocked(email)
        if(isDoctorBlocked) throw new AppError('Doctor is blocked by admin', 404)
        const isPassword: boolean = await bcrypt.compare(password, isDoctorExist?.password);
        if (!isPassword) {
            throw new AppError('Incorrect Password', 401)
        }
        const createToken = (isDoctor: Doctor): string => {
            const secretKey: string | undefined = process.env.JWT_SECRET_KEY_DOCTOR;

            if (!secretKey) {
                throw new Error('JWT secret key is not defined');
            }
            const token = jwt.sign({ isDoctor }, secretKey as string, { expiresIn: '1h' });
            return token;
        };
        const token = createToken(isDoctorExist)
        const verifiedDoctor: DoctorReturnType = {
            accessToken: token,
            doctor: isDoctorExist,
            message: 'Login success',
        }
        return verifiedDoctor
    }