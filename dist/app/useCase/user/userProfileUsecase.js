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
exports.addWallet_Usecase = exports.patientsCountsAndRatio_Usecase = exports.userProfileUpdate_Usecase = exports.userProfile_Usecase = void 0;
const error_1 = require("../../../utils/error");
const userProfile_Usecase = (userRepository) => (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findUserById(userId);
    return user;
});
exports.userProfile_Usecase = userProfile_Usecase;
const userProfileUpdate_Usecase = (userRepository) => (userId, name, email, age, phone, sex) => __awaiter(void 0, void 0, void 0, function* () {
    const User = yield userRepository.findOneUserByEmail(email);
    const UserId = User === null || User === void 0 ? void 0 : User._id.toString();
    console.log(userId);
    if (User && UserId !== userId) {
        throw new error_1.AppError('Email is already exist', 409);
    }
    const user = yield userRepository.updateUserById(userId, name, email, age, phone, sex);
    return user;
});
exports.userProfileUpdate_Usecase = userProfileUpdate_Usecase;
const patientsCountsAndRatio_Usecase = (userRepository) => () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield userRepository.PatientsCount();
    return data;
});
exports.patientsCountsAndRatio_Usecase = patientsCountsAndRatio_Usecase;
const addWallet_Usecase = (userRepository) => (id, wallet) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield userRepository.addWallet(id, wallet);
    return data;
});
exports.addWallet_Usecase = addWallet_Usecase;
