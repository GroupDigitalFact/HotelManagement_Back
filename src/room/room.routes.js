import { Router } from "express";
import { registerValidator, updateRoomValidator } from "../middlewares/room-validators.js";
import {
        AllRoomsByHotel,
        deleteRoom,
        getAvailableRooms,
        getRoom,
        registerRoom,
        updateRoom
} from "./room.controller.js";

import { uploadRoomPicture } from "../middlewares/multer-uploads.js";

const router = Router();

/**
 * @swagger
 * /room/hotel/{idHotel}:
 *   get:
 *     tags:
 *       - Room
 *     summary: Obtener habitaciones por hotel
 *     description: |
 *         Obtiene todas las habitaciones de un hotel específico.
 *         
 *         *Roles permitidos:* Público (sin autenticación)
 *         
 *         *Recomendaciones para optimizar el uso de la API:*
 *         - Envíe un idHotel válido.
 *         - Implemente paginación si espera grandes volúmenes de resultados.
 *     parameters:
 *       - in: path
 *         name: idHotel
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *     responses:
 *       '200':
 *         description: Lista de habitaciones obtenida exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               rooms: [
 *                 {
 *                   tipo: "Doble",
 *                   capacidad: 2,
 *                   precio: 100,
 *                   numeroCuarto: 101,
 *                   status: "DISPONIBLE"
 *                 }
 *               ]
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al buscar habitaciones del hotel"
 *               error: "Descripción del error"
 */
router.get("/hotel/:idHotel", AllRoomsByHotel);

/**
 * @swagger
 * /room/registerRoom:
 *   post:
 *     tags:
 *       - Room
 *     summary: Registrar una habitación
 *     description: |
 *         Permite a un administrador o encargado registrar una nueva habitación en un hotel.
 *         
 *         *Roles permitidos:* ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         *Recomendaciones para optimizar el uso de la API:*
 *         - Valide todos los campos requeridos antes de enviar la solicitud.
 *         - El campo hotelId debe ser válido y existir.
 *         - El número de habitación debe ser único por hotel.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [hotelId, tipo, capacidad, precio, numeroCuarto]
 *             properties:
 *               hotelId:
 *                 type: string
 *                 description: Identificador único del hotel.
 *               tipo:
 *                 type: string
 *                 description: Tipo de habitación.
 *                 enum: [Individual, Doble, Twin, Triple, Familiar, Suite, Junior suite, Deluxe, Presidencial]
 *               capacidad:
 *                 type: integer
 *                 description: Capacidad de la habitación.
 *               precio:
 *                 type: number
 *                 description: Precio de la habitación.
 *               numeroCuarto:
 *                 type: integer
 *                 description: Número de la habitación.
 *               roomPicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Habitación registrada exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: "Habitación registrada exitosamente"
 *               room:
 *                 tipo: "Doble"
 *                 capacidad: 2
 *                 precio: 100
 *                 numeroCuarto: 101
 *                 status: "DISPONIBLE"
 *       '400':
 *         description: Ya existe una habitación con el mismo número en este hotel.
 *         content:
 *           application/json:
 *             example:
 *               message: "Ya existe una habitación número 101 en este hotel"
 *       '404':
 *         description: Hotel no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: "No existe un hotel con el ID: 6650e1f2c8b4b2a1d4e8a456"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al registrar la habitación"
 *               error: "Descripción del error"
 */
router.post('/registerRoom', uploadRoomPicture.single("roomPicture"), registerValidator, registerRoom);

/**
 * @swagger
 * /room/deleteRoom/{roomId}:
 *   delete:
 *     tags:
 *       - Room
 *     summary: Eliminar una habitación
 *     description: |
 *         Permite a un administrador eliminar una habitación específica. Las reservas activas serán reasignadas o canceladas.
 *         
 *         *Roles permitidos:* ADMIN_ROLE
 *         
 *         *Recomendaciones para optimizar el uso de la API:*
 *         - Verifique que el identificador enviado sea correcto.
 *         - Considere el impacto en las reservas activas antes de eliminar.
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único de la habitación.
 *     responses:
 *       '200':
 *         description: Habitación eliminada exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: "Habitación eliminada correctamente. Reservaciones afectadas: 2"
 *       '404':
 *         description: Habitación no encontrada.
 *         content:
 *           application/json:
 *             example:
 *               message: "No se encontró ninguna habitación con el ID: 6650e1f2c8b4b2a1d4e8a999"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al eliminar la habitación"
 *               error: "Descripción del error"
 */
router.delete('/deleteRoom/:roomId', deleteRoom);

/**
 * @swagger
 * /room/updateRoom/{roomId}:
 *   put:
 *     tags:
 *       - Room
 *     summary: Actualizar una habitación
 *     description: |
 *         Permite a un administrador o encargado actualizar los datos de una habitación específica.
 *         
 *         *Roles permitidos:* ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         *Recomendaciones para optimizar el uso de la API:*
 *         - Valide los datos de entrada antes de enviarlos.
 *         - El número de habitación debe ser único por hotel.
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único de la habitación.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo:
 *                 type: string
 *                 description: Tipo de habitación.
 *               capacidad:
 *                 type: integer
 *                 description: Capacidad de la habitación.
 *               precio:
 *                 type: number
 *                 description: Precio de la habitación.
 *               numeroCuarto:
 *                 type: integer
 *                 description: Número de la habitación.
 *     responses:
 *       '200':
 *         description: Habitación actualizada correctamente.
 *         content:
 *           application/json:
 *             example:
 *               message: "Habitación actualizada correctamente"
 *               updatedRoom:
 *                 tipo: "Doble"
 *                 capacidad: 2
 *                 precio: 120
 *                 numeroCuarto: 102
 *                 status: "DISPONIBLE"
 *       '400':
 *         description: Ya existe una habitación con el mismo número en este hotel.
 *         content:
 *           application/json:
 *             example:
 *               message: "Ya existe una habitación con el número 102 en este hotel"
 *       '404':
 *         description: Habitación no encontrada.
 *         content:
 *           application/json:
 *             example:
 *               message: "No se encontró ninguna habitación con el ID: 6650e1f2c8b4b2a1d4e8a999"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al actualizar la habitación"
 *               error: "Descripción del error"
 */
router.put('/updateRoom/:roomId', updateRoomValidator, updateRoom);

/**
 * @swagger
 * /room/getRoom:
 *   get:
 *     tags:
 *       - Room
 *     summary: Obtener información de todas las habitaciones
 *     description: |
 *         Permite obtener información detallada de todas las habitaciones.
 *         
 *         *Roles permitidos:* Público (sin autenticación)
 *         
 *         *Recomendaciones para optimizar el uso de la API:*
 *         - Utilice filtros si desea obtener habitaciones específicas.
 *     responses:
 *       '200':
 *         description: Información de las habitaciones obtenida exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               rooms: [
 *                 {
 *                   tipo: "Suite",
 *                   capacidad: 4,
 *                   precio: 300,
 *                   numeroCuarto: 201,
 *                   status: "OCUPADA"
 *                 }
 *               ]
 *       '404':
 *         description: Rooms not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Rooms not found"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al obtener al usuario"
 *               error: "Descripción del error"
 */
router.get('/getRoom/', getRoom)

/**
 * @swagger
 * /room/getAvailableRooms:
 *   get:
 *     tags:
 *       - Room
 *     summary: Obtener habitaciones disponibles
 *     description: |
 *         Permite obtener todas las habitaciones disponibles en todos los hoteles.
 *         
 *         *Roles permitidos:* Público (sin autenticación)
 *         
 *         *Recomendaciones para optimizar el uso de la API:*
 *         - Úselo para mostrar habitaciones disponibles en tiempo real.
 *     responses:
 *       '200':
 *         description: Habitaciones disponibles encontradas.
 *         content:
 *           application/json:
 *             example:
 *               message: "Habitaciones disponibles encontradas"
 *               rooms: [
 *                 {
 *                   tipo: "Doble",
 *                   capacidad: 2,
 *                   precio: 100,
 *                   numeroCuarto: 101,
 *                   status: "DISPONIBLE"
 *                 }
 *               ]
 *       '404':
 *         description: No hay habitaciones disponibles en este momento.
 *         content:
 *           application/json:
 *             example:
 *               message: "No hay habitaciones disponibles en este momento."
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al obtener las habitaciones disponibles"
 *               error: "Descripción del error"
 */
router.get('/getAvailableRooms', getAvailableRooms);


export default router