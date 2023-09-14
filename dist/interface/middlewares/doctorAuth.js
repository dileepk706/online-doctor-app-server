"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const doctorAuth = (req, res, next) => {
    const authHeader = req.headers.accesstokendoctor;
    const secretKey = process.env.JWT_SECRET_KEY_DOCTOR;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized ' });
    }
    const token = authHeader.split(' ')[1];
    //   console.log(token);
    jsonwebtoken_1.default.verify(token, secretKey, (err, doctor) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.doctor = doctor;
        next();
    });
};
exports.default = doctorAuth;
