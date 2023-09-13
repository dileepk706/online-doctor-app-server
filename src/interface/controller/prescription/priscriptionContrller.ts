
import express, { Request, Response } from 'express';
import { CustomRequestDoc } from '../../middlewares/doctorAuth';
import { createPrescription_Usecase, getOnePatientPrescription_Usecase, getPrescription_Usecase } from '../../../app/useCase/prescription/prescription';
import { PrescriptionModel } from '../../../infra/database/model/prescription/prescription';
import prescriptionRepositoryIMPL from '../../../infra/repositories/prescription/prescriptionRepository';
import { CustomRequest } from '../../middlewares/patientAuth';

const prescriptionRepository=prescriptionRepositoryIMPL(PrescriptionModel)

export const createPrescription_Controller= async (req: CustomRequestDoc, res: Response) => {
    try {
      const { medicines,patientId} = req.body;
      const doctorId=req.doctor?.isDoctor?._id
      const newPrescritpion=await createPrescription_Usecase(prescriptionRepository)(doctorId,patientId,medicines)
      res.status(201).json(newPrescritpion);
    } catch (error:any) {
      console.log(error);
      res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }
  }

  export const getPrescription_Controller= async (req: CustomRequestDoc, res: Response) => {
    try {
      const patientId = req.query.patientId as string;
      
      const doctorId=req.doctor?.isDoctor?._id
      const prescritpions=await getPrescription_Usecase(prescriptionRepository)(doctorId,patientId)
      res.status(200).json(prescritpions);
    } catch (error:any) {
      console.log(error);
      res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }
  }
  export const getPrescriptionsForPatient_Controller= async (req: CustomRequest, res: Response) => {
    try {
      const patientId = req.user?.user?._id
      const doctorId=req.query.doctorId as string;

      const prescritpions=await getPrescription_Usecase(prescriptionRepository)(doctorId,patientId)
      res.status(200).json(prescritpions);
    } catch (error:any) {
      console.log(error);
      res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }
  }
  
  export const getAllPrescription_Controller= async (req: CustomRequestDoc, res: Response) => {
    try {
      const patientId = req.query.patientId as string;
      
      const prescritpions=await getOnePatientPrescription_Usecase(prescriptionRepository)(patientId)
      res.status(200).json(prescritpions);
    } catch (error:any) {
      console.log(error);
      res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })
    }
  }
  