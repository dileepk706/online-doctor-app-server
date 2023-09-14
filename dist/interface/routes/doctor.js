"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const doctorAuthController_1 = require("../controller/doctor/doctorAuthController");
const sloteController_1 = require("../controller/slote/sloteController");
const doctorAuth_1 = __importDefault(require("../middlewares/doctorAuth"));
const appointmentController_1 = require("../controller/appointment/appointmentController");
const doctorManagement_1 = require("../controller/doctor/doctorManagement");
const priscriptionContrller_1 = require("../controller/prescription/priscriptionContrller");
const userProfileController_1 = require("../controller/user/userProfileController");
const doctorRoute = express_1.default.Router();
//docotr auth
doctorRoute.post('/login', doctorAuthController_1.doctorLogin_Controller);
doctorRoute.post('/create-slote', doctorAuth_1.default, sloteController_1.createSloteController);
doctorRoute.get('/patients', doctorAuth_1.default, appointmentController_1.getAppointmentsControllerDoc);
doctorRoute.get('/doctor-info', doctorAuth_1.default, doctorManagement_1.getOneDoctorController);
doctorRoute.post('/prescription', doctorAuth_1.default, priscriptionContrller_1.createPrescription_Controller);
doctorRoute.get('/prescription', doctorAuth_1.default, priscriptionContrller_1.getPrescription_Controller);
doctorRoute.get('/patient/:id', doctorAuth_1.default, userProfileController_1.getUerPofile);
doctorRoute.get('/dashboard', doctorAuth_1.default, doctorManagement_1.dashbord_Controller);
exports.default = doctorRoute;
