import {MongoDBUser} from "../../database/model/patient/patient"
import { User } from "../../../domain/entities/user/userValidation";
import {userLoginType} from "../../../interface/controller/user/userLoginController"
import { AppError } from "../../../utils/error";
import { UpdateWriteOpResult } from "mongoose";

export type UserRepository = {
    createUser: (user:User|loginWithGoogleType) => Promise<User>;
    findOneUserByEmail:(email:string)=>Promise<User | null>;
    findAdminByEmail:(email:string)=>Promise<User | null>;
    getAllUsers:()=>Promise<object[] | null>;
    updateIsBlock:(userId:string,action:string)=>Promise<boolean|undefined>
    sortUser: (sortCriteria:any)=>Promise<object[] >
    PatientsCount:()=>Promise<any> 
    addWallet:(_id:string,wallet:number)=>Promise<any> 
    searchUser:(searchQuery:string,sortCriteria:{})=>Promise<object[]>
    findUserById:(_id:string)=>Promise<User|null>
    updateUserById:(userId:string,name:string, email:string,age:string,phone:string,sex:string)=>Promise<User|null>
    isPateintBlocked:(email:string)=>Promise<boolean> 
   
  };
  
type loginWithGoogleType={
    name:string;
    email:string;
    image?:string
}
const userRepositoryImpl=(UserModel:MongoDBUser):UserRepository=>{

    const createUser=async(user:User|loginWithGoogleType):Promise<User>=>{
        let newUser=await UserModel.create(user)
        return newUser
    }
    const findOneUserByEmail=async (email:string):Promise<User | null>=>{
        
        const user:User | null =await UserModel.findOne({email})
        return user;
    }
    const getAllUsers=async():Promise<object[]>=>{
        const allUsers:object[] | null=await UserModel.find({},{password:0})
        if(!allUsers)throw new AppError('Somthing went wrong when block the user',500)
        return allUsers
    }
    const updateIsBlock=async(userId:string,action:string):Promise<boolean|undefined>=>{
        //change the isBlocked bool value regards the action
        let isBlocked:boolean | undefined
        if(action==='block') isBlocked=true 
        if(action==='unblock') isBlocked=false 
        //update the isBlocked field
        const blockedUser=await UserModel.findByIdAndUpdate(userId,{isBlocked}, { new: true })
        if(!blockedUser)throw new AppError('Somthing went wrong when block the user',500)
        return isBlocked
    }
    const isPateintBlocked=async(email:string):Promise<boolean>=>{
         const user=await UserModel.findOne({email,isBlocked:true})
         if(user){
            return true
         }else{
            return false
         }
    }
    //sorting the user data with diff critirea 
    const sortUser=async(sortCriteria:any):Promise<object[] >=>{
        const sortedUsers = await UserModel.find().sort(sortCriteria);
        return sortedUsers
    }
    //search the user data 
    const searchUser=async(searchQuery:string,sortCriteria:{}):Promise<object[]>=>{
        const searchResult = await UserModel.find({ name: { $regex: searchQuery, $options: 'i' } },{password:0}).sort(sortCriteria);
        return searchResult
    }

    const findUserById=async(_id:string):Promise<User|null>=>{
        
        const user:User|null=await UserModel.findById({_id},{password:0})
        return user
    }
    const findAdminByEmail=async(email:string):Promise<User | null>=>{
        const user:User | null =await UserModel.findOne({email,isAdmin:true})
        return user;
    }

    const updateUserById=async (userId:string,name:string, email:string,age:string,phone:string,sex:string):Promise<User|null>=>{
        const updatedUser:User|null=await UserModel.findByIdAndUpdate({_id:userId},{name,email,dob:age,phone,sex},{ new: true })
        return updatedUser
    }

    const PatientsCount = async () => {
        const totalUserCount = await UserModel.countDocuments({});
        const maleUserCount = await UserModel.countDocuments({ sex: 'male' });
        const femaleUserCount = await UserModel.countDocuments({ sex: 'female' });
        return {
            totalUsers: totalUserCount,
            maleUsers: maleUserCount,
            femaleUsers: femaleUserCount,
            labels:['male','female']
          }
    }

    const addWallet=async(_id:string,wallet:number):Promise<any>=>{
        const patient:User|null=await UserModel.findById(_id)
        console.log(patient,_id,wallet)
        if(!patient?.wallet){
            const patient = await UserModel.findByIdAndUpdate({_id},{wallet})
            return patient
        }else{
            let Wallet=patient.wallet
            if(Wallet){
                Wallet=Wallet+wallet
                const patient = await UserModel.findByIdAndUpdate({_id},{wallet:Wallet})
                return patient
            }
            
        }

    } 

    
    return {createUser,findOneUserByEmail,getAllUsers, updateIsBlock,sortUser,
        searchUser,findUserById,updateUserById,isPateintBlocked,PatientsCount,addWallet,findAdminByEmail}
}

export default userRepositoryImpl;
