import userRepositoryImpl, { UserRepository } from "../../../infra/repositories/user/userRepository"
import { createToken, userLoginUserValidate } from "../../../domain/entities/user/userValidationHelper"
import { AppError } from "../../../utils/error"
import { userLoginType } from "../../../interface/controller/user/userLoginController"

export type UserReturnType = {
    accessToken: string;
    user: {};
    message:string
}

export const loginUser = (userRepository: UserRepository) => {
    return async (user: userLoginType): Promise<UserReturnType> => {
        const isUserExist: userLoginType | null = await userRepository.findOneUserByEmail(user.email)//check teh user is already exist 
        const isUerBlocked=await userRepository.isPateintBlocked(user.email)
        if(isUerBlocked) throw new AppError('User is blocked by admin', 404)
        if (!isUserExist || !isUserExist.password) throw new AppError('User is not exist', 404)
        const UserToken = await userLoginUserValidate(user, isUserExist)//validate the user credentials 
        const verifiedUser:UserReturnType = {
            accessToken: UserToken,
            user:isUserExist,
            message: 'Login success',
        }
        return verifiedUser
    }
}
export const loginWithGoogle_Uecase = (userRepository: UserRepository) =>
    async (email: string, name: string, image: string): Promise<UserReturnType> => {
        let verifiedUser:UserReturnType
        const isUserExist = await userRepository.findOneUserByEmail(email)
        if (!isUserExist) {
            const newUser = await userRepository.createUser({ email: email, name: name, image: image })
            const UserToken = createToken(newUser)
            verifiedUser = {
                accessToken: UserToken,
                user:newUser,
                message: 'Login success',
            }
            return verifiedUser
        }
        const UserToken=createToken(isUserExist)
        verifiedUser = {
            accessToken: UserToken,
            user:isUserExist,
            message: 'Login success',
        }
        return verifiedUser
    }