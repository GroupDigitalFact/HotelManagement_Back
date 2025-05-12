import { Router } from "express"
import { createExtraService, updateExtraService, deleteExtraService, getExtraServicesByHotel } from "./extraServices.controller.js"
import { createExtraServiceValidator, updateExtraServiceValidator, deleteExtraServiceValidator} from "../middlewares/extraService-validators.js"

const router = Router()

router.post('/addExtraService/:hotelId', createExtraServiceValidator, createExtraService)

router.put('/updateExtraService/:hotelId/:extraServiceId', updateExtraServiceValidator, updateExtraService)

router.delete('/DeleteExtraService/:hotelId/:extraServiceId', deleteExtraServiceValidator, deleteExtraService)

router.get('/list/:hotelId', getExtraServicesByHotel)

export default router
