import { MongoDBSlot } from "../../database/model/slote/slote"
import { Slot,slotes } from "../../../domain/entities/slote/slote"
import { ObjectId } from 'mongodb';
import moment from 'moment'

export type SloteRepository = {
    createNewSlote:(doctorId: string, slot:slotes[])=>Promise<Slot>
    findSlot:(slotDate:string,startingTime:string,endingTime:string,doctorId:string)=>Promise<Slot | null>
    findSlotByDocId:(doctorId:string)=>Promise<Slot|null>
    findSlotById:(doctorId: string,slotId:string)=> Promise<slotes | undefined> 
    findSlotByIdAndUpdate :(doctorId: string,slotId:string)=> Promise<boolean> 
}

const sloteRepositoryImpl = (SloteModel: MongoDBSlot): SloteRepository => {

    const createNewSlote = async (doctorId: string, slotes:slotes[]):Promise<Slot> => {
        
        const isSloteExist = await SloteModel.findOne({ doctor: doctorId })
        if (!isSloteExist) {
            const newSlote = new SloteModel({
                doctor: doctorId,
                slotes: slotes
            })

            const createdSlot: Slot = await newSlote.save()
            return createdSlot
        }
        
        slotes.forEach(slote=>{
            isSloteExist.slotes.push(slote)
        })
        await isSloteExist.save()
        
        return isSloteExist
    }
    const findSlot = async (slotDate: string, startingTime: string, endingTime: string, doctorId: string): Promise<Slot | null> => {
        const slot: Slot | null = await SloteModel.findOne({
          doctor: doctorId,
          'slotes.date': new Date(slotDate),
          $or: [
            {
              $and: [
                { 'slotes.slot_time': { $gte: startingTime } },
                { 'slotes.slot_time': { $lt: endingTime } }
              ]
            },
            {
              $and: [
                { 'slotes.slot_time': { $gte: new Date(`2000-01-01 ${startingTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }) } },
                { 'slotes.slot_time': { $lt: new Date(`2000-01-01 ${endingTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }) } }
              ]
            }
          ]
        });
      
        return slot;
      };
      
      const findSlotByDocId = async (doctorId: string): Promise<Slot | null> => {

        //delete the old slots
        const crr = moment().format("YYYY-MM-DD");
        const currentDate = new Date(crr)
        await SloteModel.findOneAndUpdate({ doctor: doctorId }, {
          $pull: { slotes: { date: { $lt: currentDate } } },
        });
      //   const slotsToDelete:any |null= await SloteModel.aggregate([
      //     {
      //         $match: {
      //             'slotes.slot_date': 'dileep',
      //         },
      //     },
      //     {
      //         $project: {
      //             slotes: {
      //                 $filter: {
      //                     input: '$slotes',
      //                     as: 'slot',
      //                     cond: { $eq: ['$$slot.slot_date', 'dileep'] },
      //                 },
      //             },
      //         },
      //     },
      // ]);
        
        const slot: Slot | null = await SloteModel.findOne({doctor: doctorId});
        return slot;
      };
      
      const findSlotById = async (doctorId: string,slotId:string): Promise<slotes | undefined> => {
        console.log({doctorId,slotId})
        const slotIdToFind = new ObjectId(slotId)
        const slots: Slot | null = await SloteModel.findOne({doctor: doctorId});
        const slot=slots?.slotes.find(slot=>new ObjectId(slot._id).equals(slotIdToFind))
        console.log('slote' ,slot)
        return slot;
      };
      const findSlotByIdAndUpdate = async (doctorId: string,slotId:string): Promise<boolean> => {
        const deletedSlote=await SloteModel.findOneAndUpdate({ doctor: doctorId }, {
          $pull: { slotes: { _id: slotId } },
        });
       return true
      };
      
    return {
        createNewSlote,findSlot,findSlotByDocId,findSlotByIdAndUpdate, findSlotById
    }
}

export default sloteRepositoryImpl