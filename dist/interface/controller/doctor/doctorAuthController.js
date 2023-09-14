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
exports.doctorLogin_Controller = void 0;
const doctorAuth_1 = require("../../../app/useCase/doctor/doctorAuth");
const doctorRepository_1 = __importDefault(require("../../../infra/repositories/doctor/doctorRepository"));
const doctor_1 = require("../../../infra/database/model/doctor/doctor");
const doctorRepository = (0, doctorRepository_1.default)(doctor_1.doctorModel);
const doctorLogin_Controller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const authDoctor = yield (0, doctorAuth_1.doctorAuth_Usecase)(doctorRepository)(email, password);
        res.status(200).json(authDoctor);
    }
    catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' });
    }
});
exports.doctorLogin_Controller = doctorLogin_Controller;
