import { validateDoctor } from "./doctor";
import { passwordHashing } from "../user/userValidationHelper";//this method will hash the password
import randomstring from "randomstring";

//create a random and temporary password for doctom
export const generateRandomString = (length: number) => {
  return randomstring.generate(length);
};

export const doctorValidateHelper=validateDoctor(passwordHashing,generateRandomString)

