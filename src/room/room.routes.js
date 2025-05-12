import { Router } from "express";
import { AllRoomsByHotel, registerRoom, deleteAdminRoom, updateRoomAdmin, createRoomManager, deleteRoomManager, updateRoomManager } from "./room.controller.js";
import { searchRoomValidator,registerValidator, RoomAdminValidator,updateRoomValidator } from "../middlewares/room-validators.js";

const router = Router();

router.get("/available/:idHotel?", searchRoomValidator, AllRoomsByHotel);

router.post('/registerAdmin', RoomAdminValidator, registerRoom);

router.delete('/admin/:roomId', RoomAdminValidator, deleteAdminRoom);

router.put('/adminUpdate/:roomId', RoomAdminValidator, updateRoomAdmin);

router.post('/registerManager', registerValidator, createRoomManager);

router.delete('/manager/:roomId', updateRoomValidator, deleteRoomManager);

router.put('/managerUpdate/:roomId', updateRoomValidator, updateRoomManager);



export default router

/**
 * @swagger
 * tags:
 *   - name: Room
 *     description: Endpoints relacionados con la gestión de habitaciones.
 * 
 * paths:
 *   /room/available/{idHotel}:
 *     get:
 *       tags:
 *         - Room
 *       summary: Obtener habitaciones disponibles por hotel
 *       description: Obtiene todas las habitaciones disponibles de un hotel específico.
 *       parameters:
 *         - in: path
 *           name: idHotel
 *           required: false
 *           schema:
 *             type: string
 *           description: Identificador único del hotel. Si no se proporciona, se buscarán habitaciones disponibles en todos los hoteles.
 *       responses:
 *         '200':
 *           description: Lista de habitaciones obtenida exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Room'
 *         '404':
 *           description: Hotel no encontrado o sin habitaciones disponibles.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Hotel no encontrado o sin habitaciones disponibles
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al obtener las habitaciones
 *   /room/registerAdmin:
 *     post:
 *       tags:
 *         - Room
 *       summary: Registrar una habitación (Administrador)
 *       description: Permite a un administrador registrar una nueva habitación en un hotel.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       responses:
 *         '201':
 *           description: Habitación registrada exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Habitación registrada exitosamente
 *                   room:
 *                     $ref: '#/components/schemas/Room'
 *         '400':
 *           description: Ya existe una habitación con el mismo número en este hotel.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Ya existe una habitación con el número 101 en este hotel
 *         '404':
 *           description: Hotel no encontrado.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Hotel no encontrado
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al registrar la habitación
 *   /room/admin/{roomId}:
 *     delete:
 *       tags:
 *         - Room
 *       summary: Eliminar una habitación (Administrador)
 *       description: Permite a un administrador eliminar una habitación específica.
 *       parameters:
 *         - in: path
 *           name: roomId
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único de la habitación.
 *       responses:
 *         '200':
 *           description: Habitación eliminada exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Habitación eliminada correctamente
 *         '404':
 *           description: Habitación no encontrada.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Habitación no encontrada
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al eliminar la habitación
 *   /room/adminUpdate/{roomId}:
 *     put:
 *       tags:
 *         - Room
 *       summary: Actualizar una habitación (Administrador)
 *       description: Permite a un administrador actualizar los datos de una habitación específica.
 *       parameters:
 *         - in: path
 *           name: roomId
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único de la habitación.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       responses:
 *         '200':
 *           description: Habitación actualizada exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Habitación actualizada correctamente
 *                   room:
 *                     $ref: '#/components/schemas/Room'
 *         '404':
 *           description: Habitación no encontrada.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Habitación no encontrada
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al actualizar la habitación
 *   /room/registerManager:
 *     post:
 *       tags:
 *         - Room
 *       summary: Registrar una habitación (Manager)
 *       description: Permite a un manager registrar una nueva habitación en un hotel.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       responses:
 *         '201':
 *           description: Habitación registrada exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Habitación registrada exitosamente
 *                   room:
 *                     $ref: '#/components/schemas/Room'
 *         '400':
 *           description: Ya existe una habitación con el mismo número en este hotel.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Ya existe una habitación con el número 101 en este hotel
 *         '404':
 *           description: Hotel no encontrado.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Hotel no encontrado
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al registrar la habitación
 *   /room/manager/{roomId}:
 *     delete:
 *       tags:
 *         - Room
 *       summary: Eliminar una habitación (Manager)
 *       description: Permite a un manager eliminar una habitación específica.
 *       parameters:
 *         - in: path
 *           name: roomId
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único de la habitación.
 *       responses:
 *         '200':
 *           description: Habitación eliminada exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Habitación eliminada correctamente
 *         '404':
 *           description: Habitación no encontrada.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Habitación no encontrada
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al eliminar la habitación
 *   /room/managerUpdate/{roomId}:
 *     put:
 *       tags:
 *         - Room
 *       summary: Actualizar una habitación (Manager)
 *       description: Permite a un manager actualizar los datos de una habitación específica.
 *       parameters:
 *         - in: path
 *           name: roomId
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único de la habitación.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       responses:
 *         '200':
 *           description: Habitación actualizada exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Habitación actualizada correctamente
 *                   room:
 *                     $ref: '#/components/schemas/Room'
 *         '404':
 *           description: Habitación no encontrada.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Habitación no encontrada
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al actualizar la habitación
 */
