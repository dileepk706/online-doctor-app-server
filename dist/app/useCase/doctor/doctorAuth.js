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
exports.doctorAuth_Usecase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_1 = require("../../../utils/error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const doctorAuth_Usecase = (doctorRepository) => (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const isDoctorExist = yield doctorRepository.findDoctorByEmail(email); //check teh user is already exist 
    if (!isDoctorExist)
        throw new error_1.AppError('Doctor is not exist', 404);
    const isDoctorBlocked = yield doctorRepository.isDoctorBlocked(email);
    if (isDoctorBlocked)
        throw new error_1.AppError('Doctor is blocked by admin', 404);
    const isPassword = yield bcrypt_1.default.compare(password, isDoctorExist === null || isDoctorExist === void 0 ? void 0 : isDoctorExist.password);
    if (!isPassword) {
        throw new error_1.AppError('Incorrect Password', 401);
    }
    const createToken = (isDoctor) => {
        const secretKey = process.env.JWT_SECRET_KEY_DOCTOR;
        if (!secretKey) {
            throw new Error('JWT secret key is not defined');
        }
        const token = jsonwebtoken_1.default.sign({ isDoctor }, secretKey, { expiresIn: '1h' });
        return token;
    };
    const token = createToken(isDoctorExist);
    const verifiedDoctor = {
        accessToken: token,
        doctor: isDoctorExist,
        message: 'Login success',
    };
    return verifiedDoctor;
});
exports.doctorAuth_Usecase = doctorAuth_Usecase;
