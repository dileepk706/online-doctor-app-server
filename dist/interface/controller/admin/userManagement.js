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
exports.adminLogin_Controller = exports.patientsCountsAndRatioController = exports.searchUserController = exports.sortUserController = exports.blockOrUnblockUserController = exports.getAllUserController = void 0;
const patient_1 = require("../../../infra/database/model/patient/patient");
const userRepository_1 = __importDefault(require("../../../infra/repositories/user/userRepository"));
const getAllUsers_1 = require("../../../app/useCase/admin/patients/getAllUsers");
const error_1 = require("../../../utils/error");
const block_unblockUser_1 = require("../../../app/useCase/admin/patients/block-unblockUser");
const searchSortFilter_1 = require("../../../app/useCase/admin/patients/searchSortFilter");
const userProfileUsecase_1 = require("../../../app/useCase/user/userProfileUsecase");
const reviewUseCase_1 = require("../../../app/useCase/doctor/reviewUseCase");
const getAppointents_1 = require("../../../app/useCase/appointment/getAppointents");
const appointmentRepository_1 = __importDefault(require("../../../infra/repositories/appointment/appointmentRepository"));
const appointment_1 = require("../../../infra/database/model/appointment/appointment");
const doctor_1 = require("../../../infra/database/model/doctor/doctor");
const doctorRepository_1 = __importDefault(require("../../../infra/repositories/doctor/doctorRepository"));
const adminAuth_1 = require("../../../app/useCase/admin/adminAuth");
const db = patient_1.userModel; //mogo db userModel
const userRepository = (0, userRepository_1.default)(db); // return mongodb methods related to user collection
const appointmentRepository = (0, appointmentRepository_1.default)(appointment_1.appointmentModel);
const doctorRepository = (0, doctorRepository_1.default)(doctor_1.doctorModel);
//get all users
const getAllUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield (0, getAllUsers_1.getUsers)(userRepository)();
        if (!allUsers)
            throw new error_1.AppError('Somthing went wrong while fetch the users', 500);
        res.status(200).json({ users: allUsers });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getAllUserController = getAllUserController;
//block and unblock the user
const blockOrUnblockUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.id;
        const action = req.query.action;
        if (!userId || !action)
            throw new error_1.AppError('Not found', 404);
        console.log({ userId, action });
        //call the blockOneUser function with db operation and it will retur asyn func with two params for block the user
        const blockedPatiant = yield (0, block_unblockUser_1.blockOneUser)(userRepository)(userId, action);
        if (blockedPatiant === null)
            throw new error_1.AppError('Somthing went wrong while fetch the users', 500);
        if (blockedPatiant === true) {
            res.status(200).json({ message: 'User blocked succesfully' });
            return;
        }
        else if (blockedPatiant === false) {
            res.status(200).json({ message: 'User unblocked succesfully' });
            return;
        }
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.blockOrUnblockUserController = blockOrUnblockUserController;
//sort the user data with diffriend conditions
const sortUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sortCriteria = req.query;
        const sortedUser = yield (0, searchSortFilter_1.sortUserUsecase)(userRepository)(sortCriteria);
        res.status(200).json(sortedUser);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.sortUserController = sortUserController;
//sort the user data with diffriend conditions
const searchUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.q;
        const sort = req.query.sort;
        let sortCriteria = {};
        if (sort === 'name-1')
            sortCriteria = { name: 1 };
        else if (sort === 'name1')
            sortCriteria = { name: -1 };
        else if (sort === 'age-1')
            sortCriteria = { dob: -1 };
        else if (sort === 'age1')
            sortCriteria = { dob: 1 };
        else
            sortCriteria = {};
        const searchResult = yield (0, searchSortFilter_1.searchUserUsecase)(userRepository)(searchQuery, sortCriteria);
        res.status(200).json(searchResult);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.searchUserController = searchUserController;
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
const adminLogin_Controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.body;
        //userRepository contains all dbOperations of user collection
        //login accept the userRepository as parameter and  return another function to login the user
        const userToken = yield (0, adminAuth_1.adminAuth_Usecase)(userRepository)(admin);
        res.status(200).json(userToken);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.adminLogin_Controller = adminLogin_Controller;
