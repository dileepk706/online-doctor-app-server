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
exports.adminLoginUserValidate = exports.userLoginUserValidate = exports.userCreate = exports.createTokenAdmin = exports.createToken = exports.isPasswordCorrect = exports.passwordHashing = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const userValidation_1 = require("./userValidation");
const passwordHashing = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    return hashedPassword;
});
exports.passwordHashing = passwordHashing;
const isPasswordCorrect = (plainTextPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(plainTextPassword, hashedPassword);
    const password = yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    return password;
});
exports.isPasswordCorrect = isPasswordCorrect;
const createToken = (user) => {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key is not defined');
    }
    const token = jsonwebtoken_1.default.sign({ user }, secretKey, { expiresIn: '1h' });
    return token;
};
exports.createToken = createToken;
const createTokenAdmin = (user) => {
    const secretKey = process.env.JWT_SECRET_KEY_ADMIN;
    if (!secretKey) {
        throw new Error('JWT secret key is not defined');
    }
    const token = jsonwebtoken_1.default.sign({ user }, secretKey, { expiresIn: '1h' });
    return token;
};
exports.createTokenAdmin = createTokenAdmin;
exports.userCreate = (0, userValidation_1.userSignup)(exports.passwordHashing); // validate user data 
exports.userLoginUserValidate = (0, userValidation_1.userLogin)(exports.isPasswordCorrect, exports.createToken);
exports.adminLoginUserValidate = (0, userValidation_1.adminLogin)(exports.isPasswordCorrect, exports.createTokenAdmin);
