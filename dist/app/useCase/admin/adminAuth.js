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
exports.adminAuth_Usecase = void 0;
const userValidationHelper_1 = require("../../../domain/entities/user/userValidationHelper");
const error_1 = require("../../../utils/error");
const adminAuth_Usecase = (userRepository) => (user) => __awaiter(void 0, void 0, void 0, function* () {
    const isAdmin = yield userRepository.findAdminByEmail(user.email); //check teh user is already exist 
    if (!isAdmin) {
        throw new error_1.AppError('You are not a admin', 404);
    }
    const adminToken = yield (0, userValidationHelper_1.adminLoginUserValidate)(user, isAdmin); //validate the user credentials 
    const verifiedUser = {
        accessToken: adminToken,
        admin: isAdmin,
        message: 'Login success',
    };
    return verifiedUser;
});
exports.adminAuth_Usecase = adminAuth_Usecase;
