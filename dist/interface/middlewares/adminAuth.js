"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminAuth = (req, res, next) => {
    const authHeader = req.headers.accesstokenadmin;
    const secretKey = process.env.JWT_SECRET_KEY_ADMIN;
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized ' });
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, secretKey, (err, admin) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.admin = admin;
        next();
    });
};
exports.default = adminAuth;
