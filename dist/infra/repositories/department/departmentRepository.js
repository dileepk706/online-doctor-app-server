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
const error_1 = require("../../../utils/error");
const departmentRepositoryIMPL = (DepartmentModel) => {
    // Create a new department document
    const createNewDepartment = (departmentName) => __awaiter(void 0, void 0, void 0, function* () {
        const newDeparment = new DepartmentModel({
            departmentName: departmentName,
            healthProblems: []
        });
        const createdDepartment = yield newDeparment.save();
        return createdDepartment;
    });
    //find department by name
    const findOneDepartmentByName = (departmentName) => __awaiter(void 0, void 0, void 0, function* () {
        const departmentExist = yield DepartmentModel.findOne({ departmentName });
        return departmentExist;
    });
    const findOneDepartmentById = (departmentId) => __awaiter(void 0, void 0, void 0, function* () {
        const department = yield DepartmentModel.findById(departmentId);
        if (!department)
            throw new error_1.AppError('conot find the department', 404);
        return department;
    });
    //find department by health
    const findDepartmentByHealthProblem = (healthProblem) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(healthProblem);
        const department = yield DepartmentModel.findOne({
            healthProblems: { $regex: new RegExp(healthProblem, 'i') },
        });
        if (!department)
            throw new error_1.AppError('conot find the department', 404);
        return department;
    });
    //find all department
    const findAllDepartment = () => __awaiter(void 0, void 0, void 0, function* () {
        const departments = yield DepartmentModel.find({}, { departmentName: 1 });
        return departments;
    });
    //create new health problem under the department
    const createNewHealthProblem = (departmentId, healthProblem) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const deparment = yield DepartmentModel.findById({ _id: departmentId });
        if (!deparment)
            throw new error_1.AppError('Department not found', 404);
        (_a = deparment.healthProblems) === null || _a === void 0 ? void 0 : _a.push(healthProblem);
        yield deparment.save();
        return deparment;
    });
    //delete one department
    const deletedDepartment = (departmentId) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedDepartMent = yield DepartmentModel.deleteOne({ _id: departmentId });
        if (!deletedDepartMent)
            throw new error_1.AppError('The user is not exist', 404);
        return true;
    });
    //search health problems
    const getHealthProblems = (healthProblem) => __awaiter(void 0, void 0, void 0, function* () {
        //search the health problems list from collection,it 
        const departmentsWithHealthProblems = yield DepartmentModel.aggregate([
            { $match: { healthProblems: { $regex: healthProblem, $options: 'i' } } },
            { $project: { _id: 0, healthProblems: 1 } },
        ]);
        // Extract the healthProblems arrays from the aggregation result
        const AllhealthProblems = departmentsWithHealthProblems
            .map((department) => department.healthProblems)
            .flat();
        const filteredHealthProblems = AllhealthProblems === null || AllhealthProblems === void 0 ? void 0 : AllhealthProblems.filter(problem => { var _a; return problem.toLowerCase().startsWith((_a = healthProblem === null || healthProblem === void 0 ? void 0 : healthProblem.toLowerCase()) !== null && _a !== void 0 ? _a : ''); });
        return filteredHealthProblems;
    });
    return {
        createNewDepartment, findOneDepartmentByName, createNewHealthProblem, findDepartmentByHealthProblem,
        findOneDepartmentById, findAllDepartment, deletedDepartment, getHealthProblems
    };
};
exports.default = departmentRepositoryIMPL;
