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
exports.getAppointments_UseCase = exports.createAppointment_UseCase = void 0;
const error_1 = require("../../../utils/error");
const createAppointment_UseCase = (appointmentRepository) => (slot, doctor, user, price) => __awaiter(void 0, void 0, void 0, function* () {
    if (!slot) {
        throw new error_1.AppError('Somthing went wrong', 500);
    }
    const appointment = yield appointmentRepository.createAppointment(slot, doctor, user, price);
    return appointment;
});
exports.createAppointment_UseCase = createAppointment_UseCase;
const getAppointments_UseCase = (appointmentRepository) => (user, doc) => __awaiter(void 0, void 0, void 0, function* () {
    const appointments = yield appointmentRepository.getAppointments(doc, user);
    return appointments;
});
exports.getAppointments_UseCase = getAppointments_UseCase;
