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
exports.loginWithGoogle_Uecase = exports.loginUser = void 0;
const userValidationHelper_1 = require("../../../domain/entities/user/userValidationHelper");
const error_1 = require("../../../utils/error");
const loginUser = (userRepository) => {
    return (user) => __awaiter(void 0, void 0, void 0, function* () {
        const isUserExist = yield userRepository.findOneUserByEmail(user.email); //check teh user is already exist 
        const isUerBlocked = yield userRepository.isPateintBlocked(user.email);
        if (isUerBlocked)
            throw new error_1.AppError('User is blocked by admin', 404);
        if (!isUserExist || !isUserExist.password)
            throw new error_1.AppError('User is not exist', 404);
        const UserToken = yield (0, userValidationHelper_1.userLoginUserValidate)(user, isUserExist); //validate the user credentials 
        const verifiedUser = {
            accessToken: UserToken,
            user: isUserExist,
            message: 'Login success',
        };
        return verifiedUser;
    });
};
exports.loginUser = loginUser;
const loginWithGoogle_Uecase = (userRepository) => (email, name, image) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedUser;
    const isUserExist = yield userRepository.findOneUserByEmail(email);
    if (!isUserExist) {
        const newUser = yield userRepository.createUser({ email: email, name: name, image: image });
        const UserToken = (0, userValidationHelper_1.createToken)(newUser);
        verifiedUser = {
            accessToken: UserToken,
            user: newUser,
            message: 'Login success',
        };
        return verifiedUser;
    }
    const UserToken = (0, userValidationHelper_1.createToken)(isUserExist);
    verifiedUser = {
        accessToken: UserToken,
        user: isUserExist,
        message: 'Login success',
    };
    return verifiedUser;
});
exports.loginWithGoogle_Uecase = loginWithGoogle_Uecase;
