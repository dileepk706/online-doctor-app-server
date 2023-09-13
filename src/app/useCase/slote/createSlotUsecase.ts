import { Slot } from "../../../domain/entities/slote/slote";
import { SloteRepository } from "../../../infra/repositories/slotes/slotRepository"
import { AppError } from "../../../utils/error";

export const createSlot_Usecase=(sloteRepository:SloteRepository)=>
async(doctorid:string,date:string,startTime:string, endTime:string,slotDuration:number)=>{

    const isSlotExist =await sloteRepository.findSlot(date,startTime,endTime,doctorid)
    console.log('slot data :',isSlotExist?.slotes.length );
    
    if(isSlotExist?.slotes.length ){
    console.log('slot data : ',isSlotExist);

      throw new AppError('Slots already exist',409)
    }
    const createSlotes=generateTimeSlots(startTime,endTime,slotDuration,date)
    const newSlote=await sloteRepository.createNewSlote(doctorid,createSlotes)
    return newSlote

    function generateTimeSlots(startTime:string, endTime:string, slotDuration:number,slotDate:string) {

        const slots = [];
        const start = new Date(`${slotDate } ${startTime}`);
        const end = new Date(`${slotDate } ${endTime}`);
        
        while (start < end) {
          const slotTime = start.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
          const sloteDoc={
            slot_time:slotTime,
            slot_date: date,
            date:date,
            isBooked:false
          }
          slots.push(sloteDoc);
          start.setMinutes(start.getMinutes() + slotDuration);
        }
        return slots;
      }
    
}

