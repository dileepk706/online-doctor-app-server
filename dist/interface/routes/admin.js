"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const departmentController_1 = require("../controller/admin/departmentController");
const userManagement_1 = require("../controller/admin/userManagement");
const doctorManagement_1 = require("../controller/doctor/doctorManagement");
const appointmentController_1 = require("../controller/appointment/appointmentController");
const userProfileController_1 = require("../controller/user/userProfileController");
const priscriptionContrller_1 = require("../controller/prescription/priscriptionContrller");
const adminAuth_1 = __importDefault(require("../middlewares/adminAuth"));
const adminRout = express_1.default.Router();
adminRout.post('/login', userManagement_1.adminLogin_Controller);
adminRout.post('/department', adminAuth_1.default, departmentController_1.addDepartmentController);
adminRout.delete('/department/:departmentId', adminAuth_1.default, departmentController_1.deleteDepartmentController);
adminRout.get('/all-department', adminAuth_1.default, departmentController_1.getAllDepartmentController);
adminRout.get('/get-department-by-healt', adminAuth_1.default, departmentController_1.getDepartmentByHealthProblem_Controller);
adminRout.post('/health-problem/:departmentId', adminAuth_1.default, departmentController_1.addHealthProblemController);
// adminRout.get('/patients',getAllUserController)
adminRout.patch('/block-unblock-patient', adminAuth_1.default, userManagement_1.blockOrUnblockUserController);
adminRout.get('/sort-patient', adminAuth_1.default, userManagement_1.sortUserController);
adminRout.get('/patients', adminAuth_1.default, userManagement_1.searchUserController);
adminRout.post('/add-doctor', adminAuth_1.default, doctorManagement_1.createDoctorController);
adminRout.get('/all-doctor', adminAuth_1.default, doctorManagement_1.getAllDoctorSearchFilterSortController);
adminRout.get('/appointments', adminAuth_1.default, appointmentController_1.getAllAppointmentController);
adminRout.patch('/block-unblock-doctor', adminAuth_1.default, doctorManagement_1.blockOrUnblockDoctorController);
adminRout.get('/patient/:id', adminAuth_1.default, userProfileController_1.getUerPofile);
adminRout.get('/prescription', adminAuth_1.default, priscriptionContrller_1.getAllPrescription_Controller);
adminRout.get('/doctor/:id', adminAuth_1.default, doctorManagement_1.getOneDoctorController);
adminRout.get('/dashboard', adminAuth_1.default, userManagement_1.patientsCountsAndRatioController);
adminRout.patch('/approve-cancletion', adminAuth_1.default, appointmentController_1.approveCancelation_controller);
exports.default = adminRout;
