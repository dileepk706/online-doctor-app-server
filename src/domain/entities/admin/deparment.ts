import { AppError } from "../../../utils/error";

export interface Department {
    _id?:string;
    departmentName?:string;
    healthProblems?:string[]
}

export const validateDepartmentData=(departmentName:string):string=>{
    if(!departmentName){
        throw new AppError('department name is requred',400)
    }
    return departmentName
}