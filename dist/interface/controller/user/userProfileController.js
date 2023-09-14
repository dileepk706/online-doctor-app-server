"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientsCountsAndRatioController = exports.updateUerPofile = exports.getUerPofile = void 0;
const patient_1 = require("../../../infra/database/model/patient/patient");
const userRepository_1 = __importDefault(require("../../../infra/repositories/user/userRepository"));
const userProfileUsecase_1 = require("../../../app/useCase/user/userProfileUsecase");
const reviewUseCase_1 = require("../../../app/useCase/doctor/reviewUseCase");
const doctorRepository_1 = __importDefault(require("../../../infra/repositories/doctor/doctorRepository"));
const doctor_1 = require("../../../infra/database/model/doctor/doctor");
const getAppointents_1 = require("../../../app/useCase/appointment/getAppointents");
const appointmentRepository_1 = __importDefault(require("../../../infra/repositories/appointment/appointmentRepository"));
const appointment_1 = require("../../../infra/database/model/appointment/appointment");
const db = patient_1.userModel; //Instantiate MongoDB connection 
const userRepository = (0, userRepository_1.default)(db);
const appointmentRepository = (0, appointmentRepository_1.default)(appointment_1.appointmentModel);
const doctorRepository = (0, doctorRepository_1.default)(doctor_1.doctorModel);
const getUerPofile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b._id;
        if (!userId) {
            userId = req.params.id;
        }
        const user = yield (0, userProfileUsecase_1.userProfile_Usecase)(userRepository)(userId);
        if (!user) {
            res.status(500).json({ message: 'Somthing went wrong' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getUerPofile = getUerPofile;
const updateUerPofile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const userId = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d._id;
        const { name, email, age, phone, sex } = req.body;
        const user = yield (0, userProfileUsecase_1.userProfileUpdate_Usecase)(userRepository)(userId, name, email, age, phone, sex);
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.updateUerPofile = updateUerPofile;
const patientsCountsAndRatioController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientCountData = yield (0, userProfileUsecase_1.patientsCountsAndRatio_Usecase)(userRepository)();
        const doctorCountsByDepartment = yield (0, reviewUseCase_1.doctorCountsByDepartment_Usecae)(doctorRepository)();
        const data = yield (0, getAppointents_1.getAppointmentsDahboard_UseCase)(appointmentRepository)();
        const [appointmentDahboard, revenue] = data;
        res.status(200).json({ patientCountData, doctorCountsByDepartment, appointmentDahboard, revenue });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.patientsCountsAndRatioController = patientsCountsAndRatioController;
