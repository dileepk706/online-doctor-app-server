"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorValidateHelper = exports.generateRandomString = void 0;
const doctor_1 = require("./doctor");
const userValidationHelper_1 = require("../user/userValidationHelper"); //this method will hash the password
const randomstring_1 = __importDefault(require("randomstring"));
//create a random and temporary password for doctom
const generateRandomString = (length) => {
    return randomstring_1.default.generate(length);
};
exports.generateRandomString = generateRandomString;
exports.doctorValidateHelper = (0, doctor_1.validateDoctor)(userValidationHelper_1.passwordHashing, exports.generateRandomString);
