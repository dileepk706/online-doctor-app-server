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
const error_1 = require("../../../utils/error");
const doctor_1 = require("../../database/model/doctor/doctor");
const doctorRepositoryIMPL = (DoctorModel) => {
    //create a new doctor
    const createDoctor = (doctorData) => __awaiter(void 0, void 0, void 0, function* () {
        const newDoctor = yield doctor_1.doctorModel.create(doctorData);
        return newDoctor;
    });
    //find One doctor by email
    const findDoctorByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const doctor = yield doctor_1.doctorModel.findOne({ email });
        return doctor;
    });
    //find One doctor by email
    const findDoctorById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
        const doctor = yield doctor_1.doctorModel.findById({ _id }, { createdAt: 0, updatedAt: 0, __v: 0, password: 0 }).populate('department').populate('reviews.patient');
        return doctor;
    });
    //find the all docters
    const getAllDoctors = (filters, sortCriteria) => __awaiter(void 0, void 0, void 0, function* () {
        const allDoctors = yield DoctorModel.find(filters).populate('department').sort(sortCriteria);
        return allDoctors;
    });
    const updateIsBlock = (doctorId, action) => __awaiter(void 0, void 0, void 0, function* () {
        //change the isBlocked bool value regards the action
        let isBlocked = false;
        if (action === 'block')
            isBlocked = true;
        if (action === 'unblock')
            isBlocked = false;
        //update the isBlocked field
        const blockedOrUnblockedUser = yield DoctorModel.findByIdAndUpdate(doctorId, { isBlocked }, { new: true });
        if (!blockedOrUnblockedUser)
            throw new error_1.AppError('Somthing went wrong when block the user', 500);
        return isBlocked;
    });
    const addReviewAndRating = (patient, doctor, review, rating) => __awaiter(void 0, void 0, void 0, function* () {
        let updatedDoctor;
        const doc = yield doctor_1.doctorModel.findById(doctor);
        if (!doc) {
            throw new Error('Doctor not found');
        }
        const existingReviewIndex = doc.reviews.findIndex((r) => r.patient.toString() === patient);
        if (existingReviewIndex !== -1) {
            // Update the existing review
            doc.reviews[existingReviewIndex].rating = rating;
            doc.reviews[existingReviewIndex].comment = review;
        }
        else {
            // Add a new review
            const newReview = {
                patient,
                rating,
                comment: review,
            };
            doc.reviews.push(newReview);
        }
        // Calculate the average rating
        doc.rating = Math.floor(doc.reviews.reduce((acc, item) => item.rating + acc, 0) / doc.reviews.length);
        // Save the updated doctor
        updatedDoctor = yield doc.save();
        return updatedDoctor;
    });
    const isDoctorBlocked = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const doc = yield DoctorModel.findOne({ email, isBlocked: true });
        if (doc) {
            return true;
        }
        else {
            return false;
        }
    });
    const doctorCountByDepartment = () => __awaiter(void 0, void 0, void 0, function* () {
        const doctorCountsByDepartment = yield DoctorModel.aggregate([
            {
                $lookup: {
                    from: 'departments',
                    localField: 'department',
                    foreignField: '_id',
                    as: 'departmentInfo',
                },
            },
            {
                $unwind: '$departmentInfo', // Unwind the departmentInfo array
            },
            {
                $group: {
                    _id: '$departmentInfo.departmentName',
                    count: { $sum: 1 }, // Count the doctors in each group
                },
            },
        ]);
        return doctorCountsByDepartment;
    });
    return { createDoctor, findDoctorByEmail, getAllDoctors, updateIsBlock, findDoctorById,
        addReviewAndRating, isDoctorBlocked, doctorCountByDepartment };
};
exports.default = doctorRepositoryIMPL;
