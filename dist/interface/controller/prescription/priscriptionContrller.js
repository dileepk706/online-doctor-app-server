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
exports.getAllPrescription_Controller = exports.getPrescriptionsForPatient_Controller = exports.getPrescription_Controller = exports.createPrescription_Controller = void 0;
const prescription_1 = require("../../../app/useCase/prescription/prescription");
const prescription_2 = require("../../../infra/database/model/prescription/prescription");
const prescriptionRepository_1 = __importDefault(require("../../../infra/repositories/prescription/prescriptionRepository"));
const prescriptionRepository = (0, prescriptionRepository_1.default)(prescription_2.PrescriptionModel);
const createPrescription_Controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { medicines, patientId } = req.body;
        const doctorId = (_b = (_a = req.doctor) === null || _a === void 0 ? void 0 : _a.isDoctor) === null || _b === void 0 ? void 0 : _b._id;
        const newPrescritpion = yield (0, prescription_1.createPrescription_Usecase)(prescriptionRepository)(doctorId, patientId, medicines);
        res.status(201).json(newPrescritpion);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.createPrescription_Controller = createPrescription_Controller;
const getPrescription_Controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const patientId = req.query.patientId;
        const doctorId = (_d = (_c = req.doctor) === null || _c === void 0 ? void 0 : _c.isDoctor) === null || _d === void 0 ? void 0 : _d._id;
        const prescritpions = yield (0, prescription_1.getPrescription_Usecase)(prescriptionRepository)(doctorId, patientId);
        res.status(200).json(prescritpions);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getPrescription_Controller = getPrescription_Controller;
const getPrescriptionsForPatient_Controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        const patientId = (_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f._id;
        const doctorId = req.query.doctorId;
        const prescritpions = yield (0, prescription_1.getPrescription_Usecase)(prescriptionRepository)(doctorId, patientId);
        res.status(200).json(prescritpions);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getPrescriptionsForPatient_Controller = getPrescriptionsForPatient_Controller;
const getAllPrescription_Controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientId = req.query.patientId;
        const prescritpions = yield (0, prescription_1.getOnePatientPrescription_Usecase)(prescriptionRepository)(patientId);
        res.status(200).json(prescritpions);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getAllPrescription_Controller = getAllPrescription_Controller;
