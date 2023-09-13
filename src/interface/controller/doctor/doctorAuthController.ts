import express, { Response, Request } from "express";
import { doctorAuth_Usecase } from "../../../app/useCase/doctor/doctorAuth";
import doctorRepositoryIMPL from "../../../infra/repositories/doctor/doctorRepository";
import { doctorModel } from "../../../infra/database/model/doctor/doctor";

const doctorRepository = doctorRepositoryIMPL(doctorModel)

export const doctorLogin_Controller = async (req: Request, res: Response) => {
    try {
        const email: string = req.body.email as string
        const password: string = req.body.password as string

        const authDoctor = await doctorAuth_Usecase(doctorRepository)(email, password)
        res.status(200).json(authDoctor)
    } catch (error: any) {
        res.status(error.statusCode || 500).json({ message: error.message || 'Somthing went wrong' })

    }

}