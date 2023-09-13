import express from "express"
import { addDepartmentController, addHealthProblemController, deleteDepartmentController, getAllDepartmentController, getDepartmentByHealthProblem_Controller } from "../controller/admin/departmentController"
import { adminLogin_Controller, blockOrUnblockUserController, getAllUserController, patientsCountsAndRatioController, searchUserController, sortUserController, } from "../controller/admin/userManagement"
import { blockOrUnblockDoctorController, createDoctorController, getAllDoctorSearchFilterSortController, getOneDoctorController } from "../controller/doctor/doctorManagement"
import { createSloteController } from "../controller/slote/sloteController"
import { approveCancelation_controller, getAllAppointmentController } from "../controller/appointment/appointmentController"
import { getUerPofile } from "../controller/user/userProfileController"
import { getAllPrescription_Controller } from "../controller/prescription/priscriptionContrller"
import adminAuth from "../middlewares/adminAuth"

const adminRout=express.Router()

adminRout.post('/login',adminLogin_Controller)
adminRout.post('/department',adminAuth,addDepartmentController)
adminRout.delete('/department/:departmentId',adminAuth,deleteDepartmentController)
adminRout.get('/all-department',adminAuth,getAllDepartmentController)
adminRout.get('/get-department-by-healt',adminAuth,getDepartmentByHealthProblem_Controller)
adminRout.post('/health-problem/:departmentId',adminAuth,addHealthProblemController)
// adminRout.get('/patients',getAllUserController)
adminRout.patch('/block-unblock-patient',adminAuth,blockOrUnblockUserController)
adminRout.get('/sort-patient',adminAuth,sortUserController)
adminRout.get('/patients',adminAuth,searchUserController)
adminRout.post('/add-doctor',adminAuth,createDoctorController)
adminRout.get('/all-doctor',adminAuth,getAllDoctorSearchFilterSortController)
adminRout.get('/appointments',adminAuth,getAllAppointmentController)
adminRout.patch('/block-unblock-doctor',adminAuth,blockOrUnblockDoctorController)
adminRout.get('/patient/:id',adminAuth,getUerPofile)
adminRout.get('/prescription',adminAuth,getAllPrescription_Controller)
adminRout.get('/doctor/:id',adminAuth,getOneDoctorController)
adminRout.get('/dashboard',adminAuth,patientsCountsAndRatioController)
adminRout.patch('/approve-cancletion',adminAuth,approveCancelation_controller)


export default adminRout