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
exports.approveCancelation_UseCase = exports.cancellAppointment_UseCase = exports.updateAppointmentStautus_UseCase = void 0;
const moment_1 = __importDefault(require("moment"));
const error_1 = require("../../../utils/error");
const updateAppointmentStautus_UseCase = (appointmentRepository) => (user, appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
    const appointments = yield appointmentRepository.updateAppointmentStautus(user, appointmentId);
    return appointments;
});
exports.updateAppointmentStautus_UseCase = updateAppointmentStautus_UseCase;
const cancellAppointment_UseCase = (appointmentRepository) => (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointmentRepository.getAppointmentById(id);
    const date = appointment.scheduledAt.slot_date;
    const slotDate = (0, moment_1.default)(date);
    const currentDate = new Date();
    if (appointment.status === 'consulted') {
        throw new error_1.AppError('Your already took this consultaion ', 400);
    }
    if (slotDate.toDate() <= currentDate) {
        throw new error_1.AppError('Your cancellation has rejected due to expired appointment', 400);
    }
    const cancelledAppointent = yield appointmentRepository.cancellAppoint(id);
    return cancelledAppointent;
});
exports.cancellAppointment_UseCase = cancellAppointment_UseCase;
const approveCancelation_UseCase = (appointmentRepository) => (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointmentRepository.approveCancelation(id);
    return appointment;
});
exports.approveCancelation_UseCase = approveCancelation_UseCase;
