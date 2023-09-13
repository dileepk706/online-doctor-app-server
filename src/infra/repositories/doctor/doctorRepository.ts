import { Doctor, Review } from "../../../domain/entities/doctor/doctor";
import { AppError } from "../../../utils/error";
import { MongoDBDoctor, doctorModel } from "../../database/model/doctor/doctor";
import { Filter } from "../../../interface/controller/doctor/doctorManagement";

export type DoctorRepository={
    createDoctor:(doctorData: Doctor)=>Promise<Doctor | null>
    findDoctorByEmail :(email: string)=>Promise<Doctor | null> 
    getAllDoctors:(filters:Filter,sortCriteria:object)=>Promise<Doctor[]>
    updateIsBlock:(doctorId:string,action:string)=>Promise<boolean|undefined>
    findDoctorById :(_id: string)=>Promise<Doctor | null> 
    addReviewAndRating :(patient:string,doctor:string,review:string,rating:number)=>Promise<Doctor | undefined> 
    isDoctorBlocked:(email:string)=>Promise<boolean>
    doctorCountByDepartment:()=>Promise<any>

}
const doctorRepositoryIMPL=(DoctorModel:MongoDBDoctor):DoctorRepository=>{

  //create a new doctor
   const createDoctor = async (doctorData: Doctor): Promise<Doctor | null> => {
    const newDoctor=await doctorModel.create(doctorData)
    return newDoctor
  };
  //find One doctor by email
  const findDoctorByEmail = async (email: string): Promise<Doctor | null> => {
    const doctor=await doctorModel.findOne({email})
    return doctor
  };
  //find One doctor by email
  const findDoctorById = async (_id: string): Promise<Doctor | null> => {
    const doctor:Doctor|null=await doctorModel.findById({_id},{createdAt:0,updatedAt:0,__v:0,password:0}).populate('department').populate('reviews.patient') 
    return doctor
  };
  //find the all docters
  const getAllDoctors=async(filters:Filter,sortCriteria:any):Promise<Doctor[]>=>{
    const allDoctors : Doctor[]=await DoctorModel.find(filters).populate('department').sort(sortCriteria)
    return allDoctors
  }

  const updateIsBlock=async(doctorId:string,action:string):Promise<boolean|undefined>=>{
    //change the isBlocked bool value regards the action
    let isBlocked:boolean =false
    if(action==='block') isBlocked=true 
    if(action==='unblock') isBlocked=false 
    //update the isBlocked field
    const blockedOrUnblockedUser=await DoctorModel.findByIdAndUpdate(doctorId,{isBlocked}, { new: true })
    if(!blockedOrUnblockedUser)throw new AppError('Somthing went wrong when block the user',500)
    return isBlocked
}

const addReviewAndRating = async (patient: string, doctor: string, review: string, rating: number): Promise<Doctor | undefined> => {
  let updatedDoctor: Doctor | undefined;

    const doc = await doctorModel.findById(doctor);

    if (!doc) {
      throw new Error('Doctor not found');
    }

    const existingReviewIndex = doc.reviews.findIndex((r) => r.patient.toString() === patient);

    if (existingReviewIndex !== -1) {
      // Update the existing review
      doc.reviews[existingReviewIndex].rating = rating;
      doc.reviews[existingReviewIndex].comment = review;
    } else {
      // Add a new review
      const newReview = {
        patient,
        rating,
        comment: review,
      };

      doc.reviews.push(newReview);
    }

    // Calculate the average rating
    doc.rating =Math.floor( doc.reviews.reduce((acc, item) => item.rating + acc, 0) / doc.reviews.length);

    // Save the updated doctor
    updatedDoctor = await doc.save();

  return updatedDoctor;
};

const isDoctorBlocked=async(email:string):Promise<boolean>=>{
  const doc=await DoctorModel.findOne({email,isBlocked:true})
  if(doc){
     return true
  }else{
     return false
  }
}


const doctorCountByDepartment=async():Promise<any>=>{
  const doctorCountsByDepartment = await DoctorModel.aggregate([
    {
      $lookup: {
        from: 'departments', // Assuming the department collection name is 'departments'
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
        _id: '$departmentInfo.departmentName', // Group by departmentName
        count: { $sum: 1 }, // Count the doctors in each group
      },
    },
  ]);

  return doctorCountsByDepartment
}

    return{ createDoctor,findDoctorByEmail,getAllDoctors,updateIsBlock,findDoctorById,
      addReviewAndRating,isDoctorBlocked,doctorCountByDepartment}
};

export default doctorRepositoryIMPL
 