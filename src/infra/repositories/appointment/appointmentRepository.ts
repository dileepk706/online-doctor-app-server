import mongoose from "mongoose";
import { Appointment } from "../../../domain/entities/appointment/appointment";
import { slotes } from "../../../domain/entities/slote/slote";
import { AppError, removeDuplicates } from "../../../utils/error";
import { MongoDBAppointment, appointmentModel } from "../../database/model/appointment/appointment";
import { User } from "../../../domain/entities/user/userValidation";

export type AppointmentRepository={
    createAppointment:(slot:slotes,doctor:string,user:string,price:number)=>Promise<Appointment>
    getAppointments:(user?:string,doctor?:string)=>Promise<Appointment[]>
    getAllAppointments:(filter?:string,page?:number)=>Promise<Appointment[]>
    updateAppointmentStautus:(user:string,appointmentId:string)=>Promise<any>
    getAppointmentsDashboard:()=>Promise<any>
    getPateintsCountBy_M_F:(doctorId:string)=>Promise<any>
    approveCancelation :( appointmentId:string)=>Promise<any>
    getAppointmentById:(_id:string)=>Promise<Appointment>
    cancellAppoint:(_id:string)=>Promise<Appointment>
}

const appointmentRepositoryIMPL=(AppointmentModel:MongoDBAppointment):AppointmentRepository=>{

    const createAppointment=async(slot:slotes,doctor:string,user:string,price:number):Promise<Appointment>=>{
        const appointment=new AppointmentModel({
            user:user,
            doctor:doctor,
            scheduledAt:slot,
            paymentStatus:'success',
            consultingFee:price,
        })
        const Appointment:Appointment=await appointment.save()
        return Appointment
    }
    const getAppointments=async(doctor?:string,user?:string):Promise<Appointment[]>=>{
        let appointMents:Appointment[]
        if(doctor){
            appointMents =await AppointmentModel.find({doctor}).populate('user').populate('doctor').sort({createdAt:-1})
        }else{
            appointMents =await AppointmentModel.find({user}).populate('doctor').populate('user').sort({createdAt:-1})
        }
        return appointMents
    }
    const updateAppointmentStautus=async( user:string,appointmentId:string):Promise<any>=>{
        const updatedAppintment =AppointmentModel.findByIdAndUpdate({_id:appointmentId},{$set:{status:'consulted'}},{new:true})
        return updatedAppintment
    }

    const getAllAppointments=async(filter?:any,page?:number):Promise<Appointment[]>=>{
      console.log(page)
      const limit=5
      const skip = (page || 1 - 1) * limit
        const filterObject = filter ? { status: filter } : {};
        let appointMents: Appointment[] = await AppointmentModel.find(filterObject).populate('user').populate('doctor').sort({ createdAt: -1 })
        const totalDoctors = await AppointmentModel.countDocuments({});
        return appointMents
    }
    const getAppointmentsDashboard=async ():Promise<any>=>{

        const result=await AppointmentModel.aggregate([
            {
              $group: {
                _id: null, // Group all documents
                totalCount: { $sum: 1 }, // Count all documents
                notConsultedCount: {
                  $sum: { $cond: [{ $eq: ['$status', 'notConsulted'] }, 1, 0] },
                },
                cancelledCount: {
                  $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
                },
                consultedCount: {
                  $sum: { $cond: [{ $eq: ['$status', 'consulted'] }, 1, 0] },
                },
                totalConsultingFee: {
                  $sum: { $cond: [{ $eq: ['$status', 'consulted'] }, '$consultingFee', 0] },
                },
              },
            },
          ]);

         const revenue=await AppointmentModel.aggregate([
            {
              $match: {
                status: 'consulted', // Filter documents with status='consulted'
              },
            },
            {
              $group: {
                _id: '$scheduledAt.date', // Group by the 'date' field
                totalConsultingFee: { $sum: '$consultingFee' }, // Calculate the sum of 'consultingFee'
              },
            },
          ])
           
            const {
              totalCount,
              notConsultedCount,
              cancelledCount,
              consultedCount,
              totalConsultingFee,
            } = result[0];
       
        return [result[0],revenue]
    }

    const getAppointmentById=async (_id:string):Promise<Appointment>=>{

        const appointment:Appointment|null=await appointmentModel.findById(_id)
        if(!appointment) throw new AppError('no appointments',404)
        return appointment
    }
    
    const cancellAppoint=async (_id:string):Promise<any>=>{
        const isAlreadyRequeted=await appointmentModel.findOne({_id, status:{ $in: ['cancelled', 'cancellation-requested'] }})
        
        console.log(isAlreadyRequeted)
        if(isAlreadyRequeted){
          throw new AppError('You alredy requested for the cancelation',400)
        }
        if(isAlreadyRequeted){
          throw new AppError('You alredy requested for the cancelation',400)
        }
        const appointment=await appointmentModel.findOneAndUpdate({_id,},{$set:{status:'cancellation-requested'}},{new:true})
        return appointment
    }

    const approveCancelation =async( appointmentId:string):Promise<any>=>{
      const updatedAppintment =AppointmentModel.findByIdAndUpdate({_id:appointmentId},{$set:{status:'cancelled'}},{new:true})
      return updatedAppintment
  }

  const getPateintsCountBy_M_F=async(doctorId:string)=>{
    console.log(doctorId)
    const appointment = await appointmentModel.find({doctor:doctorId}).populate('user');
    const Patients=appointment.map(e=>e.user)
    const patients:User[]=removeDuplicates(Patients)
    const malecount = patients.filter((entry) => entry.sex === 'male') 
    const femalecount = patients.filter((entry) => entry.sex === 'female') 
    const canclledAppointments = appointment.filter((e) => e.status === 'cancelled') 
    const cancelRquested = appointment.filter((e) => e.status === 'cancellation-requested') 
    const consulted  = appointment.filter((e) => e.status === 'consulted') 
    const notConsulted = appointment.filter((e) => e.status === 'notConsulted') 




    const revenueOfSingleDays=await AppointmentModel.aggregate([
      {
        $match: {
          status: 'consulted',doctor: new mongoose.Types.ObjectId(doctorId), // Filter documents with status='consulted'
        },
      },
      {
        $group: {
          _id: '$scheduledAt.date', // Group by the 'date' field
          totalConsultingFee: { $sum: '$consultingFee' }, // Calculate the sum of 'consultingFee'
        },
      },
    ])

    let totalRevenue=0
    for(let revenue of revenueOfSingleDays){
      totalRevenue=totalRevenue+revenue?.totalConsultingFee
    }

    return {
      totalUsers:patients.length,
      maleCount:malecount.length,
      femaleCount:femalecount.length,
      revenueOfSingleDays,
      totalRevenue,
      canclledAppointments:canclledAppointments.length,
      cancelRquested:cancelRquested.length,
      consulted:consulted.length,
      notConsulted:notConsulted.length,
      totalAppointments:appointment.length,
    }
    
  }
    return{
        createAppointment,getAppointments,updateAppointmentStautus,getAllAppointments
        ,getAppointmentsDashboard,getAppointmentById,cancellAppoint,approveCancelation,getPateintsCountBy_M_F
    }
}

export default appointmentRepositoryIMPL