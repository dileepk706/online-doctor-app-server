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
exports.doctorCountsByDepartment_Usecae = exports.addReview_Usecase = void 0;
const addReview_Usecase = (doctorRepository) => (patient, doctor, review, rating) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = doctorRepository.addReviewAndRating(patient, doctor, review, rating);
    return doc;
});
exports.addReview_Usecase = addReview_Usecase;
const doctorCountsByDepartment_Usecae = (doctorRepository) => () => __awaiter(void 0, void 0, void 0, function* () {
    const doctorCountsByDepartment = doctorRepository.doctorCountByDepartment();
    return doctorCountsByDepartment;
});
exports.doctorCountsByDepartment_Usecae = doctorCountsByDepartment_Usecae;
