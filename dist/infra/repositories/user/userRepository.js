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
const userRepositoryImpl = (UserModel) => {
    const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        let newUser = yield UserModel.create(user);
        return newUser;
    });
    const findOneUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UserModel.findOne({ email });
        return user;
    });
    const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
        const allUsers = yield UserModel.find({}, { password: 0 });
        if (!allUsers)
            throw new error_1.AppError('Somthing went wrong when block the user', 500);
        return allUsers;
    });
    const updateIsBlock = (userId, action) => __awaiter(void 0, void 0, void 0, function* () {
        //change the isBlocked bool value regards the action
        let isBlocked;
        if (action === 'block')
            isBlocked = true;
        if (action === 'unblock')
            isBlocked = false;
        //update the isBlocked field
        const blockedUser = yield UserModel.findByIdAndUpdate(userId, { isBlocked }, { new: true });
        if (!blockedUser)
            throw new error_1.AppError('Somthing went wrong when block the user', 500);
        return isBlocked;
    });
    const isPateintBlocked = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UserModel.findOne({ email, isBlocked: true });
        if (user) {
            return true;
        }
        else {
            return false;
        }
    });
    //sorting the user data with diff critirea 
    const sortUser = (sortCriteria) => __awaiter(void 0, void 0, void 0, function* () {
        const sortedUsers = yield UserModel.find().sort(sortCriteria);
        return sortedUsers;
    });
    //search the user data 
    const searchUser = (searchQuery, sortCriteria) => __awaiter(void 0, void 0, void 0, function* () {
        const searchResult = yield UserModel.find({ name: { $regex: searchQuery, $options: 'i' } }, { password: 0 }).sort(sortCriteria);
        return searchResult;
    });
    const findUserById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UserModel.findById({ _id }, { password: 0 });
        return user;
    });
    const findAdminByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UserModel.findOne({ email, isAdmin: true });
        return user;
    });
    const updateUserById = (userId, name, email, age, phone, sex) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = yield UserModel.findByIdAndUpdate({ _id: userId }, { name, email, dob: age, phone, sex }, { new: true });
        return updatedUser;
    });
    const PatientsCount = () => __awaiter(void 0, void 0, void 0, function* () {
        const totalUserCount = yield UserModel.countDocuments({});
        const maleUserCount = yield UserModel.countDocuments({ sex: 'male' });
        const femaleUserCount = yield UserModel.countDocuments({ sex: 'female' });
        return {
            totalUsers: totalUserCount,
            maleUsers: maleUserCount,
            femaleUsers: femaleUserCount,
            labels: ['male', 'female']
        };
    });
    const addWallet = (_id, wallet) => __awaiter(void 0, void 0, void 0, function* () {
        const patient = yield UserModel.findById(_id);
        console.log(patient, _id, wallet);
        if (!(patient === null || patient === void 0 ? void 0 : patient.wallet)) {
            const patient = yield UserModel.findByIdAndUpdate({ _id }, { wallet });
            return patient;
        }
        else {
            let Wallet = patient.wallet;
            if (Wallet) {
                Wallet = Wallet + wallet;
                const patient = yield UserModel.findByIdAndUpdate({ _id }, { wallet: Wallet });
                return patient;
            }
        }
    });
    return { createUser, findOneUserByEmail, getAllUsers, updateIsBlock, sortUser,
        searchUser, findUserById, updateUserById, isPateintBlocked, PatientsCount, addWallet, findAdminByEmail };
};
exports.default = userRepositoryImpl;
