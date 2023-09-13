

import { DepartmetRepository } from "../../../../infra/repositories/department/departmentRepository"
import { Department, validateDepartmentData } from "../../../../domain/entities/admin/deparment"
import { AppError } from "../../../../utils/error"
import { DoctorRepository } from "../../../../infra/repositories/doctor/doctorRepository"
import { Doctor } from "../../../../domain/entities/doctor/doctor"

export const getAllDepartment_Usecase=(departmentRepository:DepartmetRepository)=>
async ():Promise<object[] | null>=>{
    const allDepartments=await departmentRepository.findAllDepartment()
    return allDepartments
}
export const getDepartmentByHealthProblem_Usecase=(departmentRepository:DepartmetRepository)=>
async (healthProblem:string):Promise<Department>=>{
    // const allDepartments=await departmentRepository.findAllDepartment()
    const allDepartments=await departmentRepository.findDepartmentByHealthProblem(healthProblem)
    if(!allDepartments)throw new AppError('conot find the department',404)
    return allDepartments
}
export const getAllHealthProblems_Usecase=(departmentRepository:DepartmetRepository)=>
async(healthProblem:string):Promise<string[]|null>=>{
    const healthProblems=await departmentRepository.getHealthProblems(healthProblem)
    return healthProblems
}
export const get_doc_dep_health_Usecase=(departmentRepository:DepartmetRepository,doctorRepository:DoctorRepository)=>
async():Promise<any>=>{
    type deparment={
        _id?:string;
        departmentName?:string
    }
    const allDepartments:deparment[] | null=await departmentRepository.findAllDepartment()
    const allHealthProblems=await departmentRepository.getHealthProblems('')
    const allDoctors=await doctorRepository.getAllDoctors({},{})
    const deparments=allDepartments?.map(deprtment=> ({name:deprtment?.departmentName,feild:'Department',_id:deprtment?._id}))
    const doctors=allDoctors?.map(doc=> ({name:doc.name,feild:'Doctor'}))
    const healthProblems=allHealthProblems?.map(health=> ({name:health,feild:'Health issue'}))
    const doc_dep_health=[...healthProblems ?? '',...doctors ?? '',...deparments ?? '']
    return doc_dep_health 
}
export const getAllDoctersByHealthIssue_Uecase=(departmentRepository:DepartmetRepository,doctorRepository:DoctorRepository)=>
async(healthProblem:string):Promise<Doctor[] | null>=>{
    
    const department=await departmentRepository.findDepartmentByHealthProblem(healthProblem)
    const allDoctors=await doctorRepository.getAllDoctors({department:department?._id},{})
    return allDoctors 
}
