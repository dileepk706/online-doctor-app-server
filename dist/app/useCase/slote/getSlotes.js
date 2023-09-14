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
exports.getBookedSlote_Usecase = exports.getSlots_Usecase = void 0;
const moment_1 = __importDefault(require("moment"));
const getSlots_Usecase = (sloteRepository) => (doctorid) => __awaiter(void 0, void 0, void 0, function* () {
    //take filter the slotes except today
    const currentDate = (0, moment_1.default)().format("YYYY-MM-DD");
    const slote = yield sloteRepository.findSlotByDocId(doctorid);
    const slotes = slote === null || slote === void 0 ? void 0 : slote.slotes;
    const afterTodaySlots = ((slotes === null || slotes === void 0 ? void 0 : slotes.filter(e => {
        return currentDate !== e.slot_date;
    })) || []);
    const currentTime = (0, moment_1.default)();
    //take today time slote except past time
    const todaySlots = ((slotes === null || slotes === void 0 ? void 0 : slotes.filter(time => {
        const formattedTime = (0, moment_1.default)(time.slot_time, 'h:mm A');
        return formattedTime.isAfter(currentTime);
    })) || []);
    return [...todaySlots, ...afterTodaySlots];
});
exports.getSlots_Usecase = getSlots_Usecase;
const getBookedSlote_Usecase = (sloteRepository) => (doctorId, slotId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookedSlote = yield sloteRepository.findSlotById(doctorId, slotId);
    yield sloteRepository.findSlotByIdAndUpdate(doctorId, slotId);
    return bookedSlote;
});
exports.getBookedSlote_Usecase = getBookedSlote_Usecase;
