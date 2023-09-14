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
exports.createSlot_Usecase = void 0;
const error_1 = require("../../../utils/error");
const createSlot_Usecase = (sloteRepository) => (doctorid, date, startTime, endTime, slotDuration) => __awaiter(void 0, void 0, void 0, function* () {
    const isSlotExist = yield sloteRepository.findSlot(date, startTime, endTime, doctorid);
    console.log('slot data :', isSlotExist === null || isSlotExist === void 0 ? void 0 : isSlotExist.slotes.length);
    if (isSlotExist === null || isSlotExist === void 0 ? void 0 : isSlotExist.slotes.length) {
        console.log('slot data : ', isSlotExist);
        throw new error_1.AppError('Slots already exist', 409);
    }
    const createSlotes = generateTimeSlots(startTime, endTime, slotDuration, date);
    const newSlote = yield sloteRepository.createNewSlote(doctorid, createSlotes);
    return newSlote;
    function generateTimeSlots(startTime, endTime, slotDuration, slotDate) {
        const slots = [];
        const start = new Date(`${slotDate} ${startTime}`);
        const end = new Date(`${slotDate} ${endTime}`);
        while (start < end) {
            const slotTime = start.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            const sloteDoc = {
                slot_time: slotTime,
                slot_date: date,
                date: date,
                isBooked: false
            };
            slots.push(sloteDoc);
            start.setMinutes(start.getMinutes() + slotDuration);
        }
        return slots;
    }
});
exports.createSlot_Usecase = createSlot_Usecase;
