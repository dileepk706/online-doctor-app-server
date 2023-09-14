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
exports.approveCancelation_controller = exports.cancellAppointment = exports.getAllAppointmentController = exports.updateAppointStatus = exports.consultedDoctors_Controller = exports.getAppointmentsControllerDoc = exports.getAppointmentsControllerPatient = void 0;
const createAppointment_1 = require("../../../app/useCase/appointment/createAppointment");
const appointmentRepository_1 = __importDefault(require("../../../infra/repositories/appointment/appointmentRepository"));
const appointment_1 = require("../../../infra/database/model/appointment/appointment");
const updateAppointment_1 = require("../../../app/useCase/appointment/updateAppointment");
const getAppointents_1 = require("../../../app/useCase/appointment/getAppointents");
const userProfileUsecase_1 = require("../../../app/useCase/user/userProfileUsecase");
const userRepository_1 = __importDefault(require("../../../infra/repositories/user/userRepository"));
const patient_1 = require("../../../infra/database/model/patient/patient");
const userRepository = (0, userRepository_1.default)(patient_1.userModel);
const appointmentRepository = (0, appointmentRepository_1.default)(appointment_1.appointmentModel);
const getAppointmentsControllerPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b._id;
        const appointments = yield (0, createAppointment_1.getAppointments_UseCase)(appointmentRepository)(userId, undefined);
        res.status(200).json(appointments);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getAppointmentsControllerPatient = getAppointmentsControllerPatient;
const getAppointmentsControllerDoc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const docId = (_d = (_c = req.doctor) === null || _c === void 0 ? void 0 : _c.isDoctor) === null || _d === void 0 ? void 0 : _d._id;
        const appointments = yield (0, createAppointment_1.getAppointments_UseCase)(appointmentRepository)(undefined, docId);
        res.status(200).json(appointments);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getAppointmentsControllerDoc = getAppointmentsControllerDoc;
const consultedDoctors_Controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        const userId = (_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f._id;
        const appointments = yield (0, createAppointment_1.getAppointments_UseCase)(appointmentRepository)(userId, undefined);
        res.status(200).json(appointments);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.consultedDoctors_Controller = consultedDoctors_Controller;
const updateAppointStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    try {
        const userId = (_h = (_g = req.user) === null || _g === void 0 ? void 0 : _g.user) === null || _h === void 0 ? void 0 : _h._id;
        const appointmentId = req.body.id;
        const updatedAppointments = yield (0, updateAppointment_1.updateAppointmentStautus_UseCase)(appointmentRepository)(userId, appointmentId);
        res.status(200).json(updatedAppointments);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.updateAppointStatus = updateAppointStatus;
const getAllAppointmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.status;
        const page = Number(req.query.page);
        const appointments = yield (0, getAppointents_1.getAllAppointments_UseCase)(appointmentRepository)(filter, page);
        res.status(200).json(appointments);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getAllAppointmentController = getAllAppointmentController;
const cancellAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentId = req.body.id;
        const cancelledAppointment = yield (0, updateAppointment_1.cancellAppointment_UseCase)(appointmentRepository)(appointmentId);
        res.status(200).json(cancelledAppointment);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.cancellAppointment = cancellAppointment;
const approveCancelation_controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentId = req.body.id;
        const cancelledAppointment = yield (0, updateAppointment_1.approveCancelation_UseCase)(appointmentRepository)(appointmentId);
        const patientId = cancelledAppointment.user;
        const wallet = cancelledAppointment.consultingFee;
        const addWalletPateint = yield (0, userProfileUsecase_1.addWallet_Usecase)(userRepository)(patientId.toString(), wallet);
        res.status(200).json(cancelledAppointment);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.approveCancelation_controller = approveCancelation_controller;
