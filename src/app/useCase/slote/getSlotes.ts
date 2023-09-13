import { Slot, slotes } from "../../../domain/entities/slote/slote";
import { SloteRepository } from "../../../infra/repositories/slotes/slotRepository"
import { AppError } from "../../../utils/error";
import moment from 'moment'

export const getSlots_Usecase=(sloteRepository:SloteRepository)=>
async(doctorid:string ):Promise<slotes[]|undefined>=>{
     
     //take filter the slotes except today
     const currentDate = moment().format("YYYY-MM-DD");
     const slote:Slot|null = await sloteRepository.findSlotByDocId(doctorid)
     const slotes:slotes[]|undefined=slote?.slotes
     const afterTodaySlots = (slotes?.filter(e => {
          return currentDate !== e.slot_date;
      })||[])as slotes[];
     
     const currentTime = moment();  
     
     //take today time slote except past time
     const todaySlots = (slotes?.filter(time => {
          const formattedTime = moment(time.slot_time, 'h:mm A');
          return formattedTime.isAfter(currentTime) ;
      }) || []) as slotes[];

     return [...todaySlots,...afterTodaySlots]
    
}

export const getBookedSlote_Usecase=(sloteRepository:SloteRepository)=>
async (doctorId: string,slotId:string):Promise<slotes|undefined>=>{
     const bookedSlote:slotes|undefined=await sloteRepository.findSlotById(doctorId,slotId)
     await sloteRepository.findSlotByIdAndUpdate(doctorId,slotId)
     return bookedSlote
}
