"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDuplicates = exports.AppError = void 0;
class AppError extends Error {
    constructor(mssge, statusCode) {
        super(mssge);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
const removeDuplicates = (arr) => {
    const strArr = arr.map((obj) => JSON.stringify(obj));
    const uniq = [...new Set(strArr)].map((u) => JSON.parse(u));
    return uniq;
};
exports.removeDuplicates = removeDuplicates;
