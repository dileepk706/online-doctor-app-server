import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import dotenv  from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../.env')});

import { adminLogin, userLogin, userSignup } from "./userValidation";

export const passwordHashing:Function =async(password:string):Promise<string>=>{
    const hashedPassword = await bcrypt.hash(password,10);
    return hashedPassword 
}
export const isPasswordCorrect = async(plainTextPassword:string,hashedPassword:string):Promise<boolean>=>{
    console.log(plainTextPassword,hashedPassword);
    
    const password:boolean=await bcrypt.compare(plainTextPassword, hashedPassword);
    return password
}
export const createToken = (user:any): string => {
   
    const secretKey:string | undefined = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key is not defined');
      }
    const token = jwt.sign({ user}, secretKey as string, { expiresIn: '1h' }); 
    return token;
};

export const createTokenAdmin = (user:any): string => {
   
    const secretKey:string | undefined = process.env.JWT_SECRET_KEY_ADMIN;
    if (!secretKey) {
        throw new Error('JWT secret key is not defined');
      }
    const token = jwt.sign({ user}, secretKey as string, { expiresIn: '1h' }); 
    return token;
};

export const userCreate=userSignup(passwordHashing)// validate user data 
export const userLoginUserValidate=userLogin(isPasswordCorrect,createToken)
export const adminLoginUserValidate=adminLogin(isPasswordCorrect,createTokenAdmin)


