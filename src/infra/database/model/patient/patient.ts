import mongoose, { Document, Model, Schema } from 'mongoose';
import { User } from '../../../../domain/entities/user/userValidation';

export type MongoDBUser = Model<Document<any, any, any> & User>;

// Define the schema for the user collection
const userSchema = new Schema<User>({
  name: { type: String, required: true},
  email:  { type: String, required: true,unique:true},
  password:  { type: String},
  isMailVarified: { type: Boolean, default: false },
  phone:String,
  image: String,
  address: {
    houseNo:{type:String,trim:true},
    city:{type:String,trim:true},
    state:{type:String,trim:true},
    country:{type:String,trim:true},
  },
  dob:{type:Number,trim:true},
  wallet:{type:Number,trim:true},
  isAdmin:{type:Boolean},
  desease:[String],
  isBlocked:{type:Boolean,default:false},
  sex:{type:String,enum:['male,female']}
  }, {
    timestamps: { createdAt: true}
  });

export const userModel: MongoDBUser = mongoose.connection.model<Document<any, any, any> & User>('user', userSchema);