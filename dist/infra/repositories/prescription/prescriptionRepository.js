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
const prescriptionRepositoryIMPL = (PrescriptionModel) => {
    const createPrescription = (doctor, patient, medicines, date, prescriptionNumber) => __awaiter(void 0, void 0, void 0, function* () {
        const newPrescription = new PrescriptionModel({
            doctor,
            patient,
            medicines,
            date,
            prescriptionNumber
        });
        const createdPrescription = yield newPrescription.save();
        if (!createdPrescription)
            throw new error_1.AppError('Somthing went wrong when creating the prescription', 500);
        return createdPrescription;
    });
    const getPrescriptionsOnepatient = (doctor, patient) => __awaiter(void 0, void 0, void 0, function* () {
        const prescritions = yield PrescriptionModel.find({ doctor, patient })
            .populate({
            path: 'doctor',
            populate: {
                path: 'department',
            },
        })
            .populate('patient')
            .sort({ createdAt: -1 });
        return prescritions;
    });
    const getAllPrescriptionsOnepatient = (patient) => __awaiter(void 0, void 0, void 0, function* () {
        const prescritions = yield PrescriptionModel.find({ patient })
            .populate({
            path: 'doctor',
            populate: {
                path: 'department',
            },
        })
            .populate('patient')
            .sort({ createdAt: -1 });
        return prescritions;
    });
    return {
        createPrescription, getPrescriptionsOnepatient, getAllPrescriptionsOnepatient
    };
};
exports.default = prescriptionRepositoryIMPL;
