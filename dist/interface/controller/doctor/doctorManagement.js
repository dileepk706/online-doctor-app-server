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
exports.dashbord_Controller = exports.getOneDoctorController = exports.blockOrUnblockDoctorController = exports.getAllDoctorSearchFilterSortController = exports.createDoctorController = void 0;
const createDoctor_1 = require("../../../app/useCase/admin/doctor/createDoctor");
const doctorRepository_1 = __importDefault(require("../../../infra/repositories/doctor/doctorRepository"));
const doctor_1 = require("../../../infra/database/model/doctor/doctor");
const departmentRepository_1 = __importDefault(require("../../../infra/repositories/department/departmentRepository"));
const department_1 = require("../../../infra/database/model/department/department");
const getSearchSortFilter_1 = require("../../../app/useCase/admin/doctor/getSearchSortFilter");
const error_1 = require("../../../utils/error");
const block_unblockDoctor_1 = require("../../../app/useCase/admin/doctor/block-unblockDoctor");
const getAppointents_1 = require("../../../app/useCase/appointment/getAppointents");
const appointmentRepository_1 = __importDefault(require("../../../infra/repositories/appointment/appointmentRepository"));
const appointment_1 = require("../../../infra/database/model/appointment/appointment");
const appointmentRepository = (0, appointmentRepository_1.default)(appointment_1.appointmentModel);
const departmentRepository = (0, departmentRepository_1.default)(department_1.departmentModel); //mongodb query methods of departmet
const doctorRepository = (0, doctorRepository_1.default)(doctor_1.doctorModel); //mongodb query methods of doctor
const createDoctorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorData = req.body;
        //create new doctor
        const newDoctorPassword = yield (0, createDoctor_1.createDoctorUsecase)(doctorRepository, departmentRepository)(doctorData);
        console.log(newDoctorPassword);
        res.status(200).send({ message: 'Doctor create succesfully..', password: newDoctorPassword });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.createDoctorController = createDoctorController;
const getAllDoctorSearchFilterSortController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //define the sorting and filtering object
        let sortCriteria;
        let filterData = {};
        //finding wich i the sort criteria and make a object for mogodb sorting
        if (req.query.sort && req.query.sort === "consultingFee-1")
            sortCriteria = { consultingFee: -1 };
        else if (req.query.sort && req.query.sort === "consultingFee1")
            sortCriteria = { consultingFee: 1 };
        else if (req.query.sort && req.query.sort === "yearOfExperiance-1")
            sortCriteria = { yearOfExperiance: -1 };
        else if (req.query.sort && req.query.sort === "yearOfExperiance1")
            sortCriteria = { yearOfExperiance: 1 };
        else
            sortCriteria = {};
        //make the filtering object with the request object if the filters available
        if (req.query.name)
            filterData.name = { $regex: req.query.name, $options: 'i' };
        if (req.query.department)
            filterData.department = req.query.department;
        if (req.query.sex)
            filterData.sex = req.query.sex;
        if (req.query.rating) {
            filterData.rating = {
                $gte: parseInt(req.query.rating)
            };
        }
        if (req.query.gte && req.query.lte) {
            filterData.consultingFee = {
                $gte: parseInt(req.query.gte), $lte: parseInt(req.query.lte)
            };
        }
        const doctorsList = yield (0, getSearchSortFilter_1.getAllDoctorUsecase)(doctorRepository)(filterData, sortCriteria);
        res.status(200).json(doctorsList);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getAllDoctorSearchFilterSortController = getAllDoctorSearchFilterSortController;
//block and unblock the doctor
const blockOrUnblockDoctorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.query.id;
        const action = req.query.action;
        if (!doctorId || !action)
            throw new error_1.AppError('Not found', 404);
        //call the function with db operation and it will retur asyn func with two params for block the user
        const blockedOrUnblockedDoctor = yield (0, block_unblockDoctor_1.blockOrUnblockDoctorUsecase)(doctorRepository)(doctorId, action);
        if (blockedOrUnblockedDoctor === null)
            throw new error_1.AppError('Somthing went wrong while fetch the users', 500);
        if (blockedOrUnblockedDoctor === true) {
            res.status(200).json({ message: 'Docotr blocked succesfully' });
            return;
        }
        else if (blockedOrUnblockedDoctor === false) {
            res.status(200).json({ message: 'Doctor unblocked succesfully' });
            return;
        }
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.blockOrUnblockDoctorController = blockOrUnblockDoctorController;
const getOneDoctorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let doctorId = req.params.id;
        if (!doctorId) {
            doctorId = (_b = (_a = req.doctor) === null || _a === void 0 ? void 0 : _a.isDoctor) === null || _b === void 0 ? void 0 : _b._id;
        }
        const doctor = yield (0, getSearchSortFilter_1.getOneDoctor_UseCase)(doctorRepository)(doctorId);
        res.status(200).json(doctor);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getOneDoctorController = getOneDoctorController;
const dashbord_Controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const doctorId = (_d = (_c = req.doctor) === null || _c === void 0 ? void 0 : _c.isDoctor) === null || _d === void 0 ? void 0 : _d._id;
        const appointmentDashbord = yield (0, getAppointents_1.patientsCountsAndRatioByDocId_Usecase)(appointmentRepository)(doctorId);
        res.status(200).json(appointmentDashbord);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.dashbord_Controller = dashbord_Controller;
