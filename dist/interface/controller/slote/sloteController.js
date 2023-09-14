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
exports.bookSloteController = exports.getSlotesController = exports.createSloteController = void 0;
const slotRepository_1 = __importDefault(require("../../../infra/repositories/slotes/slotRepository"));
const slote_1 = require("../../../infra/database/model/slote/slote");
const createSlotUsecase_1 = require("../../../app/useCase/slote/createSlotUsecase");
const moment_1 = __importDefault(require("moment"));
const error_1 = require("../../../utils/error");
const getSlotes_1 = require("../../../app/useCase/slote/getSlotes");
const appointmentRepository_1 = __importDefault(require("../../../infra/repositories/appointment/appointmentRepository"));
const appointment_1 = require("../../../infra/database/model/appointment/appointment");
const createAppointment_1 = require("../../../app/useCase/appointment/createAppointment");
const appointmentRepository = (0, appointmentRepository_1.default)(appointment_1.appointmentModel);
const sloteRepository = (0, slotRepository_1.default)(slote_1.slotModel);
const createSloteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let token = req.headers.accesstoken;
        const doctor = (_b = (_a = req.doctor) === null || _a === void 0 ? void 0 : _a.isDoctor) === null || _b === void 0 ? void 0 : _b._id;
        const date = req.body.slotDate;
        const startTime = req.body.startTime;
        const endTime = req.body.endTime;
        const slotDuration = req.body.slotDuration;
        const startingTime = (0, moment_1.default)(startTime, 'h:mm A');
        const currentDate = new Date();
        const slotDate = (0, moment_1.default)(date);
        const endingTime = (0, moment_1.default)(endTime, 'h:mm A');
        if (!date || !startTime || !endTime || !slotDuration) {
            throw new error_1.AppError('All fields are required', 400);
        }
        //validate is slot date greater than curent date date
        if (slotDate.toDate() <= currentDate) {
            throw new error_1.AppError('Slot date must be in the future', 400);
        }
        //validate is ending time greater than starting time
        const expectedEndingTime = startingTime.clone().add(slotDuration, 'minutes');
        if (endingTime.isSameOrBefore(expectedEndingTime)) {
            throw new error_1.AppError('Ending time must be greater than starting time plus slot duration', 400);
        }
        if (endingTime.isBefore(startingTime)) {
            throw new error_1.AppError('Ending time cannot be less than starting time', 400);
        }
        const newSlote = yield (0, createSlotUsecase_1.createSlot_Usecase)(sloteRepository)(doctor, date, startTime, endTime, slotDuration);
        res.send(newSlote);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.createSloteController = createSloteController;
const getSlotesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.params.id;
        const slots = yield (0, getSlotes_1.getSlots_Usecase)(sloteRepository)(doctorId);
        res.status(200).json(slots);
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.getSlotesController = getSlotesController;
const bookSloteController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const userId = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d._id;
        const doctorId = req.body.doctorId;
        const slotId = req.body.slotId;
        const consultingFee = req.body.consultingFee;
        const bookedSlote = yield (0, getSlotes_1.getBookedSlote_Usecase)(sloteRepository)(doctorId, slotId);
        if (!bookedSlote) {
            throw new error_1.AppError('Somthing went wrong while booking slote', 500);
        }
        const appointment = yield (0, createAppointment_1.createAppointment_UseCase)(appointmentRepository)(bookedSlote, doctorId, userId, consultingFee);
        if (!appointment) {
            throw new error_1.AppError('Somthing went wrong while booking slote', 500);
        }
        console.log('slotye  : ', appointment);
        res.status(200).json({ messag: 'Appointment created' });
    }
    catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.bookSloteController = bookSloteController;
