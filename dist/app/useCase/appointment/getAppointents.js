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
exports.patientsCountsAndRatioByDocId_Usecase = exports.getAppointmentsDahboard_UseCase = exports.getAllAppointments_UseCase = void 0;
const getAllAppointments_UseCase = (appointmentRepository) => (filter, page) => __awaiter(void 0, void 0, void 0, function* () {
    const appointments = yield appointmentRepository.getAllAppointments(filter, page);
    return appointments;
});
exports.getAllAppointments_UseCase = getAllAppointments_UseCase;
const getAppointmentsDahboard_UseCase = (appointmentRepository) => (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const appointments = yield appointmentRepository.getAppointmentsDashboard();
    return appointments;
});
exports.getAppointmentsDahboard_UseCase = getAppointmentsDahboard_UseCase;
const patientsCountsAndRatioByDocId_Usecase = (appointmentRepository) => (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield appointmentRepository.getPateintsCountBy_M_F(doctorId);
    return data;
});
exports.patientsCountsAndRatioByDocId_Usecase = patientsCountsAndRatioByDocId_Usecase;
