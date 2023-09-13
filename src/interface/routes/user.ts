
import express, { Request, Response } from "express"
import { userSignup } from "../controller/user/userSignupController";
import { loginWithGoogle_Controller, userLogin } from "../controller/user/userLoginController";
import { addReviewAndRatingController, getAllDepartments, getAllDoc_Dep_Health_Controller, getAllDoctorsByHealthIssue_Controler, getHealthProblems_Controller } from "../controller/user/departmentController";
import UserAuthenticateToken from "../middlewares/patientAuth";
import { getAllDoctorSearchFilterSortController, getOneDoctorController } from "../controller/doctor/doctorManagement";
import { bookSloteController, getSlotesController } from "../controller/slote/sloteController";
import { checkoutController } from "../controller/user/checkout";
import { cancellAppointment, consultedDoctors_Controller, getAppointmentsControllerPatient, updateAppointStatus } from "../controller/appointment/appointmentController";
import { getUerPofile, updateUerPofile } from "../controller/user/userProfileController";
import { getDepartmentByHealthProblem_Controller } from "../controller/admin/departmentController";
import { getPrescriptionsForPatient_Controller } from "../controller/prescription/priscriptionContrller";


const userRoute = express.Router()

//uer auth
userRoute.post('/signup', userSignup)
userRoute.post('/login', userLogin)
userRoute.post('/login-googleAuth', loginWithGoogle_Controller);

userRoute.get('/getalldepartments', UserAuthenticateToken, getAllDepartments)
userRoute.get('/healthProblems', getHealthProblems_Controller)
userRoute.get('/get-department-by-healt',getDepartmentByHealthProblem_Controller)
userRoute.get('/get-alldoctor-alldepartment-allhealth', getAllDoc_Dep_Health_Controller)
userRoute.get('/get-all-doctors-by-heathIsue', getAllDoctorsByHealthIssue_Controler)
userRoute.get('/all-doctor', getAllDoctorSearchFilterSortController);
userRoute.get('/doctor-info/:id', getOneDoctorController);
userRoute.get('/slots/:id', getSlotesController);
userRoute.post('/create-checkout-session', UserAuthenticateToken,checkoutController);
userRoute.post('/book-slot', UserAuthenticateToken,bookSloteController);
userRoute.get('/appointments', UserAuthenticateToken,getAppointmentsControllerPatient);
userRoute.get('/profile', UserAuthenticateToken,getUerPofile);
userRoute.post('/edit-profile', UserAuthenticateToken,updateUerPofile);
userRoute.put('/edit-appointment-status', UserAuthenticateToken,updateAppointStatus);
userRoute.put('/review-rating',UserAuthenticateToken,addReviewAndRatingController);
userRoute.put('/cancell-appointment',UserAuthenticateToken,cancellAppointment);
userRoute.get('/doctors/consulted',UserAuthenticateToken,consultedDoctors_Controller);
userRoute.get('/prescriptions',UserAuthenticateToken,getPrescriptionsForPatient_Controller);






export default userRoute
