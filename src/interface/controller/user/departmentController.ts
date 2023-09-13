import { Request, Response } from "express";
import { CustomRequest } from "../../middlewares/patientAuth"
import { getAllDepartment_Usecase, getAllDoctersByHealthIssue_Uecase, getAllHealthProblems_Usecase, get_doc_dep_health_Usecase } from "../../../app/useCase/admin/department/getSearchSortFIlter";
import departmentRepositoryIMPL from "../../../infra/repositories/department/departmentRepository";
import { departmentModel } from "../../../infra/database/model/department/department";
import doctorRepositoryIMPL from "../../../infra/repositories/doctor/doctorRepository";
import { doctorModel } from "../../../infra/database/model/doctor/doctor";
import { addReview_Usecase } from "../../../app/useCase/doctor/reviewUseCase";
import { patientsCountsAndRatio_Usecase } from "../../../app/useCase/user/userProfileUsecase";

const departmentRepository = departmentRepositoryIMPL(departmentModel)
const doctorRepository = doctorRepositoryIMPL(doctorModel)
export const getAllDepartments = async (req: CustomRequest, res: Response) => {
   try {
      const departments = await getAllDepartment_Usecase(departmentRepository)()
      res.status(200).json(departments)
   }
   catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
   }
}
export const getHealthProblems_Controller = async (req: CustomRequest, res: Response) => {
   try {
      const q: string = req.query.q as string

      const departments = await getAllHealthProblems_Usecase(departmentRepository)(q)
      res.status(200).json(departments)
   }
   catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
   }
}

export const getAllDoc_Dep_Health_Controller = async (req: CustomRequest, res: Response) => {
   try {
      const docter_department_health = await get_doc_dep_health_Usecase(departmentRepository, doctorRepository)()
      res.status(200).json(docter_department_health)
   } catch (error: any) {
      console.log(error);

      res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
   }
}
export const getAllDoctorsByHealthIssue_Controler = async (req: CustomRequest, res: Response) => {
   const healthProblem: string = req.query.healthProblem as string

   try {
      const docters = await getAllDoctersByHealthIssue_Uecase(departmentRepository, doctorRepository)(healthProblem)
      res.status(200).json(docters)
   } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
   }
}

export const addReviewAndRatingController = async (req: CustomRequest, res: Response) => {

   try {
      const patient = req.user?.user?._id
      const { rating, review, doctor } = req.body
      console.log({rating, review, doctor,patient})
      const Review=await addReview_Usecase(doctorRepository)(patient, doctor, review,rating  )

      res.status(200).json(Review)
   } catch (error: any) {  
      console.log(error);
      res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
   }

}

