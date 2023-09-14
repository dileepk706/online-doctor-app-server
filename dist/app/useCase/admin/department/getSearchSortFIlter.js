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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDoctersByHealthIssue_Uecase = exports.get_doc_dep_health_Usecase = exports.getAllHealthProblems_Usecase = exports.getDepartmentByHealthProblem_Usecase = exports.getAllDepartment_Usecase = void 0;
const error_1 = require("../../../../utils/error");
const getAllDepartment_Usecase = (departmentRepository) => () => __awaiter(void 0, void 0, void 0, function* () {
    const allDepartments = yield departmentRepository.findAllDepartment();
    return allDepartments;
});
exports.getAllDepartment_Usecase = getAllDepartment_Usecase;
const getDepartmentByHealthProblem_Usecase = (departmentRepository) => (healthProblem) => __awaiter(void 0, void 0, void 0, function* () {
    // const allDepartments=await departmentRepository.findAllDepartment()
    const allDepartments = yield departmentRepository.findDepartmentByHealthProblem(healthProblem);
    if (!allDepartments)
        throw new error_1.AppError('conot find the department', 404);
    return allDepartments;
});
exports.getDepartmentByHealthProblem_Usecase = getDepartmentByHealthProblem_Usecase;
const getAllHealthProblems_Usecase = (departmentRepository) => (healthProblem) => __awaiter(void 0, void 0, void 0, function* () {
    const healthProblems = yield departmentRepository.getHealthProblems(healthProblem);
    return healthProblems;
});
exports.getAllHealthProblems_Usecase = getAllHealthProblems_Usecase;
const get_doc_dep_health_Usecase = (departmentRepository, doctorRepository) => () => __awaiter(void 0, void 0, void 0, function* () {
    const allDepartments = yield departmentRepository.findAllDepartment();
    const allHealthProblems = yield departmentRepository.getHealthProblems('');
    const allDoctors = yield doctorRepository.getAllDoctors({}, {});
    const deparments = allDepartments === null || allDepartments === void 0 ? void 0 : allDepartments.map(deprtment => ({ name: deprtment === null || deprtment === void 0 ? void 0 : deprtment.departmentName, feild: 'Department', _id: deprtment === null || deprtment === void 0 ? void 0 : deprtment._id }));
    const doctors = allDoctors === null || allDoctors === void 0 ? void 0 : allDoctors.map(doc => ({ name: doc.name, feild: 'Doctor' }));
    const healthProblems = allHealthProblems === null || allHealthProblems === void 0 ? void 0 : allHealthProblems.map(health => ({ name: health, feild: 'Health issue' }));
    const doc_dep_health = [...healthProblems !== null && healthProblems !== void 0 ? healthProblems : '', ...doctors !== null && doctors !== void 0 ? doctors : '', ...deparments !== null && deparments !== void 0 ? deparments : ''];
    return doc_dep_health;
});
exports.get_doc_dep_health_Usecase = get_doc_dep_health_Usecase;
const getAllDoctersByHealthIssue_Uecase = (departmentRepository, doctorRepository) => (healthProblem) => __awaiter(void 0, void 0, void 0, function* () {
    const department = yield departmentRepository.findDepartmentByHealthProblem(healthProblem);
    const allDoctors = yield doctorRepository.getAllDoctors({ department: department === null || department === void 0 ? void 0 : department._id }, {});
    return allDoctors;
});
exports.getAllDoctersByHealthIssue_Uecase = getAllDoctersByHealthIssue_Uecase;
