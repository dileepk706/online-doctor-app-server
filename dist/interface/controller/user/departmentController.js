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
exports.addReviewAndRatingController = exports.getAllDoctorsByHealthIssue_Controler = exports.getAllDoc_Dep_Health_Controller = exports.getHealthProblems_Controller = exports.getAllDepartments = void 0;
const getSearchSortFIlter_1 = require("../../../app/useCase/admin/department/getSearchSortFIlter");
const departmentRepository_1 = __importDefault(require("../../../infra/repositories/department/departmentRepository"));
const department_1 = require("../../../infra/database/model/department/department");
const doctorRepository_1 = __importDefault(require("../../../infra/repositories/doctor/doctorRepository"));
const doctor_1 = require("../../../infra/database/model/doctor/doctor");
const reviewUseCase_1 = require("../../../app/useCase/doctor/reviewUseCase");
const departmentRepository = (0, departmentRepository_1.default)(department_1.departmentModel);
const doctorRepository = (0, doctorRepository_1.default)(doctor_1.doctorModel);
const getAllDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield (0, getSearchSortFIlter_1.getAllDepartment_Usecase)(departmentRepository)();
        res.status(200).json(departments);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getAllDepartments = getAllDepartments;
const getHealthProblems_Controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = req.query.q;
        const departments = yield (0, getSearchSortFIlter_1.getAllHealthProblems_Usecase)(departmentRepository)(q);
        res.status(200).json(departments);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getHealthProblems_Controller = getHealthProblems_Controller;
const getAllDoc_Dep_Health_Controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const docter_department_health = yield (0, getSearchSortFIlter_1.get_doc_dep_health_Usecase)(departmentRepository, doctorRepository)();
        res.status(200).json(docter_department_health);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getAllDoc_Dep_Health_Controller = getAllDoc_Dep_Health_Controller;
const getAllDoctorsByHealthIssue_Controler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const healthProblem = req.query.healthProblem;
    try {
        const docters = yield (0, getSearchSortFIlter_1.getAllDoctersByHealthIssue_Uecase)(departmentRepository, doctorRepository)(healthProblem);
        res.status(200).json(docters);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getAllDoctorsByHealthIssue_Controler = getAllDoctorsByHealthIssue_Controler;
const addReviewAndRatingController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const patient = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b._id;
        const { rating, review, doctor } = req.body;
        console.log({ rating, review, doctor, patient });
        const Review = yield (0, reviewUseCase_1.addReview_Usecase)(doctorRepository)(patient, doctor, review, rating);
        res.status(200).json(Review);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.addReviewAndRatingController = addReviewAndRatingController;
