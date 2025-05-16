import { Router } from "express"
import { createExtraService, updateExtraService, deleteExtraService, getExtraServicesByHotel } from "./extraServices.controller.js"
import { createExtraServiceValidator, updateExtraServiceValidator, deleteExtraServiceValidator} from "../middlewares/extraService-validators.js"

const router = Router()


/**
 * @swagger
 * /extraService/addExtraService/{hotelId}:
 *   post:
 *     tags:
 *       - ExtraService
 *     summary: Crear un servicio adicional para un hotel
 *     description: |
 *         Permite crear un nuevo servicio adicional asociado a un hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide todos los campos requeridos antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - En caso de error de validación, revise los mensajes detallados en la respuesta.
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del servicio adicional.
 *               cost:
 *                 type: number
 *                 description: Costo del servicio adicional.
 *               description:
 *                 type: string
 *                 description: Descripción del servicio adicional.
 *           example:
 *             name: "Desayuno buffet"
 *             cost: 15.5
 *             description: "Desayuno buffet disponible de 7am a 10am."
 *     responses:
 *       '201':
 *         description: Servicio adicional creado correctamente.
 *       '404':
 *         description: Hotel no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/addExtraService/:hotelId', createExtraServiceValidator, createExtraService)


/**
 * @swagger
 * /extraService/updateExtraService/{hotelId}/{extraServiceId}:
 *   put:
 *     tags:
 *       - ExtraService
 *     summary: Actualizar un servicio adicional
 *     description: |
 *         Permite actualizar los datos de un servicio adicional existente.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Actualice solo los campos necesarios para optimizar el rendimiento.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *       - in: path
 *         name: extraServiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del servicio adicional.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del servicio adicional.
 *               cost:
 *                 type: number
 *                 description: Costo del servicio adicional.
 *               description:
 *                 type: string
 *                 description: Descripción del servicio adicional.
 *           example:
 *             name: "Desayuno buffet premium"
 *             cost: 20
 *             description: "Desayuno buffet con opciones premium."
 *     responses:
 *       '200':
 *         description: Servicio adicional actualizado correctamente.
 *       '404':
 *         description: Servicio adicional no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.put('/updateExtraService/:hotelId/:extraServiceId', updateExtraServiceValidator, updateExtraService)


/**
 * @swagger
 * /extraService/DeleteExtraService/{hotelId}/{extraServiceId}:
 *   delete:
 *     tags:
 *       - ExtraService
 *     summary: Eliminar un servicio adicional
 *     description: |
 *         Permite eliminar un servicio adicional de un hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Verifique que los identificadores enviados sean correctos.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Evite realizar múltiples eliminaciones innecesarias para optimizar el rendimiento.
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *       - in: path
 *         name: extraServiceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del servicio adicional.
 *     responses:
 *       '200':
 *         description: Servicio adicional eliminado correctamente.
 *       '404':
 *         description: Servicio adicional no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.delete('/DeleteExtraService/:hotelId/:extraServiceId', deleteExtraServiceValidator, deleteExtraService)


/**
 * @swagger
 * /extraService/list/{hotelId}:
 *   get:
 *     tags:
 *       - ExtraService
 *     summary: Listar servicios adicionales por hotel
 *     description: |
 *         Obtiene todos los servicios adicionales asociados a un hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros o paginación si espera una gran cantidad de servicios adicionales.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Valide que el identificador del hotel sea correcto.
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *     responses:
 *       '200':
 *         description: Lista de servicios adicionales obtenida exitosamente.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/list/:hotelId', getExtraServicesByHotel)

export default router

