
import { Doctor } from "../../../../domain/entities/doctor/doctor"
import { DoctorRepository } from "../../../../infra/repositories/doctor/doctorRepository"
import { Filter } from "../../../../interface/controller/doctor/doctorManagement"

export const getAllDoctorUsecase = (doctorRepository: DoctorRepository) =>
    async (filters: Filter, sortCriteria: object): Promise<Object[]> => {
        const allDoctors = doctorRepository.getAllDoctors(filters, sortCriteria)
        return allDoctors

    }

export const getOneDoctor_UseCase = (doctorRepository: DoctorRepository) =>
    async (doctorId:string):Promise<Doctor|null> => {

        const doctor:Doctor|null = await doctorRepository.findDoctorById(doctorId)
        return doctor
    }