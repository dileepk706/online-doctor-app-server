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
const mongodb_1 = require("mongodb");
const moment_1 = __importDefault(require("moment"));
const sloteRepositoryImpl = (SloteModel) => {
    const createNewSlote = (doctorId, slotes) => __awaiter(void 0, void 0, void 0, function* () {
        const isSloteExist = yield SloteModel.findOne({ doctor: doctorId });
        if (!isSloteExist) {
            const newSlote = new SloteModel({
                doctor: doctorId,
                slotes: slotes
            });
            const createdSlot = yield newSlote.save();
            return createdSlot;
        }
        slotes.forEach(slote => {
            isSloteExist.slotes.push(slote);
        });
        yield isSloteExist.save();
        return isSloteExist;
    });
    const findSlot = (slotDate, startingTime, endingTime, doctorId) => __awaiter(void 0, void 0, void 0, function* () {
        const slot = yield SloteModel.findOne({
            doctor: doctorId,
            'slotes.date': new Date(slotDate),
            $or: [
                {
                    $and: [
                        { 'slotes.slot_time': { $gte: startingTime } },
                        { 'slotes.slot_time': { $lt: endingTime } }
                    ]
                },
                {
                    $and: [
                        { 'slotes.slot_time': { $gte: new Date(`2000-01-01 ${startingTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }) } },
                        { 'slotes.slot_time': { $lt: new Date(`2000-01-01 ${endingTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }) } }
                    ]
                }
            ]
        });
        return slot;
    });
    const findSlotByDocId = (doctorId) => __awaiter(void 0, void 0, void 0, function* () {
        //delete the old slots
        const crr = (0, moment_1.default)().format("YYYY-MM-DD");
        const currentDate = new Date(crr);
        yield SloteModel.findOneAndUpdate({ doctor: doctorId }, {
            $pull: { slotes: { date: { $lt: currentDate } } },
        });
        //   const slotsToDelete:any |null= await SloteModel.aggregate([
        //     {
        //         $match: {
        //             'slotes.slot_date': 'dileep',
        //         },
        //     },
        //     {
        //         $project: {
        //             slotes: {
        //                 $filter: {
        //                     input: '$slotes',
        //                     as: 'slot',
        //                     cond: { $eq: ['$$slot.slot_date', 'dileep'] },
        //                 },
        //             },
        //         },
        //     },
        // ]);
        const slot = yield SloteModel.findOne({ doctor: doctorId });
        return slot;
    });
    const findSlotById = (doctorId, slotId) => __awaiter(void 0, void 0, void 0, function* () {
        console.log({ doctorId, slotId });
        const slotIdToFind = new mongodb_1.ObjectId(slotId);
        const slots = yield SloteModel.findOne({ doctor: doctorId });
        const slot = slots === null || slots === void 0 ? void 0 : slots.slotes.find(slot => new mongodb_1.ObjectId(slot._id).equals(slotIdToFind));
        console.log('slote', slot);
        return slot;
    });
    const findSlotByIdAndUpdate = (doctorId, slotId) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedSlote = yield SloteModel.findOneAndUpdate({ doctor: doctorId }, {
            $pull: { slotes: { _id: slotId } },
        });
        return true;
    });
    return {
        createNewSlote, findSlot, findSlotByDocId, findSlotByIdAndUpdate, findSlotById
    };
};
exports.default = sloteRepositoryImpl;
