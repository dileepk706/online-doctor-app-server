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
exports.getOnePatientPrescription_Usecase = exports.getPrescription_Usecase = exports.createPrescription_Usecase = void 0;
const doctorValidateHelper_1 = require("../../../domain/entities/doctor/doctorValidateHelper");
const moment_1 = __importDefault(require("moment"));
const createPrescription_Usecase = (PrescriptionRepository) => (doctor, patient, medicines) => __awaiter(void 0, void 0, void 0, function* () {
    const date = (0, moment_1.default)().format('YYYY-MM-DD');
    const prescriptionNumber = `PRE000${(0, doctorValidateHelper_1.generateRandomString)(6)}`;
    const newPrescription = yield PrescriptionRepository.createPrescription(doctor, patient, medicines, date, prescriptionNumber);
    return newPrescription;
});
exports.createPrescription_Usecase = createPrescription_Usecase;
const getPrescription_Usecase = (PrescriptionRepository) => (doctor, patient) => __awaiter(void 0, void 0, void 0, function* () {
    const newPrescription = yield PrescriptionRepository.getPrescriptionsOnepatient(doctor, patient);
    return newPrescription;
});
exports.getPrescription_Usecase = getPrescription_Usecase;
const getOnePatientPrescription_Usecase = (PrescriptionRepository) => (patient) => __awaiter(void 0, void 0, void 0, function* () {
    const newPrescription = yield PrescriptionRepository.getAllPrescriptionsOnepatient(patient);
    return newPrescription;
});
exports.getOnePatientPrescription_Usecase = getOnePatientPrescription_Usecase;
