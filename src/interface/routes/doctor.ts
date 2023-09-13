
import express from "express"
import {doctorLogin_Controller} from '../controller/doctor/doctorAuthController'
import { createSloteController } from "../controller/slote/sloteController"
import doctorAuth from "../middlewares/doctorAuth"
import { getAppointmentsControllerDoc } from "../controller/appointment/appointmentController"
import { dashbord_Controller, getOneDoctorController } from "../controller/doctor/doctorManagement"
import { createPrescription_Controller, getPrescription_Controller } from "../controller/prescription/priscriptionContrller"
import { getUerPofile } from "../controller/user/userProfileController"

const doctorRoute=express.Router()

//docotr auth
doctorRoute.post('/login',doctorLogin_Controller)
doctorRoute.post('/create-slote',doctorAuth,createSloteController)
doctorRoute.get('/patients',doctorAuth,getAppointmentsControllerDoc)
doctorRoute.get('/doctor-info',doctorAuth,getOneDoctorController)
doctorRoute.post('/prescription',doctorAuth,createPrescription_Controller)
doctorRoute.get('/prescription',doctorAuth,getPrescription_Controller)
doctorRoute.get('/patient/:id',doctorAuth,getUerPofile)
doctorRoute.get('/dashboard',doctorAuth,dashbord_Controller)



export default doctorRoute