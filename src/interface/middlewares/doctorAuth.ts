import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface CustomRequestDoc extends Request {
  doctor?: any; // Customize the type of 'user' property as per your application's needs
}

const doctorAuth = (req: CustomRequestDoc, res: Response, next: NextFunction) => {
  const authHeader:string | undefined = req.headers.accesstokendoctor as string;
  const secretKey:string | undefined = process.env.JWT_SECRET_KEY_DOCTOR;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized ' });
  }

  const token = authHeader.split(' ')[1];
//   console.log(token);
  
  jwt.verify(token, secretKey as string, (err, doctor) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.doctor = doctor;
    next();
  });
};

export default doctorAuth;
