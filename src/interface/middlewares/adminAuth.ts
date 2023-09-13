import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface CustomRequestDoc extends Request {
  admin?: any; // Customize the type of 'user' property as per your application's needs
}

const adminAuth = (req: CustomRequestDoc, res: Response, next: NextFunction) => {
  const authHeader:string | undefined = req.headers.accesstokenadmin as string;
  const secretKey:string | undefined = process.env.JWT_SECRET_KEY_ADMIN;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized ' });
  }

  const token = authHeader.split(' ')[1];
 
  
  jwt.verify(token, secretKey as string, (err, admin) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.admin = admin;
    next();
  });
};

export default adminAuth;
