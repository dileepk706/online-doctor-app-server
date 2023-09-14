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
const mongoose_1 = __importDefault(require("mongoose"));
const error_1 = require("../../../utils/error");
const appointment_1 = require("../../database/model/appointment/appointment");
const appointmentRepositoryIMPL = (AppointmentModel) => {
    const createAppointment = (slot, doctor, user, price) => __awaiter(void 0, void 0, void 0, function* () {
        const appointment = new AppointmentModel({
            user: user,
            doctor: doctor,
            scheduledAt: slot,
            paymentStatus: 'success',
            consultingFee: price,
        });
        const Appointment = yield appointment.save();
        return Appointment;
    });
    const getAppointments = (doctor, user) => __awaiter(void 0, void 0, void 0, function* () {
        let appointMents;
        if (doctor) {
            appointMents = yield AppointmentModel.find({ doctor }).populate('user').populate('doctor').sort({ createdAt: -1 });
        }
        else {
            appointMents = yield AppointmentModel.find({ user }).populate('doctor').populate('user').sort({ createdAt: -1 });
        }
        return appointMents;
    });
    const updateAppointmentStautus = (user, appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedAppintment = AppointmentModel.findByIdAndUpdate({ _id: appointmentId }, { $set: { status: 'consulted' } }, { new: true });
        return updatedAppintment;
    });
    const getAllAppointments = (filter, page) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(page);
        const limit = 5;
        const skip = (page || 1 - 1) * limit;
        const filterObject = filter ? { status: filter } : {};
        let appointMents = yield AppointmentModel.find(filterObject).populate('user').populate('doctor').sort({ createdAt: -1 });
        const totalDoctors = yield AppointmentModel.countDocuments({});
        return appointMents;
    });
    const getAppointmentsDashboard = () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield AppointmentModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalCount: { $sum: 1 },
                    notConsultedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'notConsulted'] }, 1, 0] },
                    },
                    cancelledCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
                    },
                    consultedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'consulted'] }, 1, 0] },
                    },
                    totalConsultingFee: {
                        $sum: { $cond: [{ $eq: ['$status', 'consulted'] }, '$consultingFee', 0] },
                    },
                },
            },
        ]);
        const revenue = yield AppointmentModel.aggregate([
            {
                $match: {
                    status: 'consulted', // Filter documents with status='consulted'
                },
            },
            {
                $group: {
                    _id: '$scheduledAt.date',
                    totalConsultingFee: { $sum: '$consultingFee' }, // Calculate the sum of 'consultingFee'
                },
            },
        ]);
        const { totalCount, notConsultedCount, cancelledCount, consultedCount, totalConsultingFee, } = result[0];
        return [result[0], revenue];
    });
    const getAppointmentById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
        const appointment = yield appointment_1.appointmentModel.findById(_id);
        if (!appointment)
            throw new error_1.AppError('no appointments', 404);
        return appointment;
    });
    const cancellAppoint = (_id) => __awaiter(void 0, void 0, void 0, function* () {
        const isAlreadyRequeted = yield appointment_1.appointmentModel.findOne({ _id, status: { $in: ['cancelled', 'cancellation-requested'] } });
        console.log(isAlreadyRequeted);
        if (isAlreadyRequeted) {
            throw new error_1.AppError('You alredy requested for the cancelation', 400);
        }
        if (isAlreadyRequeted) {
            throw new error_1.AppError('You alredy requested for the cancelation', 400);
        }
        const appointment = yield appointment_1.appointmentModel.findOneAndUpdate({ _id, }, { $set: { status: 'cancellation-requested' } }, { new: true });
        return appointment;
    });
    const approveCancelation = (appointmentId) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedAppintment = AppointmentModel.findByIdAndUpdate({ _id: appointmentId }, { $set: { status: 'cancelled' } }, { new: true });
        return updatedAppintment;
    });
    const getPateintsCountBy_M_F = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(doctorId);
        const appointment = yield appointment_1.appointmentModel.find({ doctor: doctorId }).populate('user');
        const Patients = appointment.map(e => e.user);
        const patients = (0, error_1.removeDuplicates)(Patients);
        const malecount = patients.filter((entry) => entry.sex === 'male');
        const femalecount = patients.filter((entry) => entry.sex === 'female');
        const canclledAppointments = appointment.filter((e) => e.status === 'cancelled');
        const cancelRquested = appointment.filter((e) => e.status === 'cancellation-requested');
        const consulted = appointment.filter((e) => e.status === 'consulted');
        const notConsulted = appointment.filter((e) => e.status === 'notConsulted');
        const revenueOfSingleDays = yield AppointmentModel.aggregate([
            {
                $match: {
                    status: 'consulted', doctor: new mongoose_1.default.Types.ObjectId(doctorId), // Filter documents with status='consulted'
                },
            },
            {
                $group: {
                    _id: '$scheduledAt.date',
                    totalConsultingFee: { $sum: '$consultingFee' }, // Calculate the sum of 'consultingFee'
                },
            },
        ]);
        let totalRevenue = 0;
        for (let revenue of revenueOfSingleDays) {
            totalRevenue = totalRevenue + (revenue === null || revenue === void 0 ? void 0 : revenue.totalConsultingFee);
        }
        return {
            totalUsers: patients.length,
            maleCount: malecount.length,
            femaleCount: femalecount.length,
            revenueOfSingleDays,
            totalRevenue,
            canclledAppointments: canclledAppointments.length,
            cancelRquested: cancelRquested.length,
            consulted: consulted.length,
            notConsulted: notConsulted.length,
            totalAppointments: appointment.length,
        };
    });
    return {
        createAppointment, getAppointments, updateAppointmentStautus, getAllAppointments,
        getAppointmentsDashboard, getAppointmentById, cancellAppoint, approveCancelation, getPateintsCountBy_M_F
    };
};
exports.default = appointmentRepositoryIMPL;
