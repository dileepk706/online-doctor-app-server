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
exports.deleteDepartmentController = exports.getDepartmentByHealthProblem_Controller = exports.getAllDepartmentController = exports.addHealthProblemController = exports.addDepartmentController = void 0;
const addDeparmet_1 = require("../../../app/useCase/admin/department/addDeparmet");
const department_1 = require("../../../infra/database/model/department/department");
const departmentRepository_1 = __importDefault(require("../../../infra/repositories/department/departmentRepository"));
const addHealthProblem_1 = require("../../../app/useCase/admin/healthProblem/addHealthProblem");
const getSearchSortFIlter_1 = require("../../../app/useCase/admin/department/getSearchSortFIlter");
const deleteDpartment_1 = require("../../../app/useCase/admin/department/deleteDpartment");
const departmentRepository = (0, departmentRepository_1.default)(department_1.departmentModel);
const addDepartmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departmentName = req.body.departmentName;
        const newDepartment = yield (0, addDeparmet_1.addOneDepartment)(departmentRepository)(departmentName);
        if (!newDepartment) {
            res.status(500).json({ message: 'Somthing went wrong' });
            return;
        }
        res.status(200).json({ message: 'Department added succesfully' });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.addDepartmentController = addDepartmentController;
const addHealthProblemController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departmentId = req.params.departmentId;
        const healthProblem = req.body.concern;
        // Check if healthProblem is empty or contains only whitespace
        if (!healthProblem || !departmentId || /^\s*$/.test(healthProblem)) {
            res.status(400).json({ message: 'health problem is requred' });
            return;
        }
        const newConcern = yield (0, addHealthProblem_1.addNewHealthProblem)(departmentRepository)(departmentId, healthProblem);
        if (!newConcern) {
            res.status(500).json({ message: 'Somthing went wrong' });
            return;
        }
        res.status(200).json({ message: 'Health Problem added succesfully' });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.addHealthProblemController = addHealthProblemController;
const getAllDepartmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield (0, getSearchSortFIlter_1.getAllDepartment_Usecase)(departmentRepository)();
        res.status(200).json({ message: 'Ok', departments });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getAllDepartmentController = getAllDepartmentController;
const getDepartmentByHealthProblem_Controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const healthProblem = req.query.healthProblem;
        const departments = yield (0, getSearchSortFIlter_1.getDepartmentByHealthProblem_Usecase)(departmentRepository)(healthProblem);
        res.status(200).json(departments);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getDepartmentByHealthProblem_Controller = getDepartmentByHealthProblem_Controller;
const deleteDepartmentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departmentId = req.params.departmentId;
        const deletedDepartment = (0, deleteDpartment_1.deleteDepartmentUsecase)(departmentRepository)(departmentId);
        res.status(200).json({ message: 'Department deleted succusfully', });
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.deleteDepartmentController = deleteDepartmentController;
