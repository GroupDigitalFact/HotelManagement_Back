import { Router } from "express";
import { AllRoomsByHotel, 
        registerRoom, 
        deleteRoom,
        updateRoom,
        getRoom
        } from "./room.controller.js";
import { searchRoomValidator,registerValidator, RoomAdminValidator,updateRoomValidator } from "../middlewares/room-validators.js";

const router = Router();


/**
 * @swagger
 * /room/available/{idHotel}:
 *   get:
 *     tags:
 *       - Room
 *     summary: Obtener habitaciones disponibles por hotel
 *     description: |
 *         Obtiene todas las habitaciones disponibles de un hotel específico.
 *         
 *         **Roles permitidos:** Público (sin autenticación)
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros adecuados para evitar consultas innecesariamente grandes.
 *         - Implemente paginación si espera grandes volúmenes de resultados.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     parameters:
 *       - in: path
 *         name: idHotel
 *         required: false
 *         schema:
 *           type: string
 *         description: Identificador único del hotel. Si no se proporciona, se buscarán habitaciones disponibles en todos los hoteles.
 *     responses:
 *       '200':
 *         description: Lista de habitaciones obtenida exitosamente.
 *       '404':
 *         description: Hotel no encontrado o sin habitaciones disponibles.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get("/available/:idHotel?", searchRoomValidator, AllRoomsByHotel);

/**
 * @swagger
 * /room/registerAdmin:
 *   post:
 *     tags:
 *       - Room
 *     summary: Registrar una habitación (Administrador)
 *     description: |
 *         Permite a un administrador registrar una nueva habitación en un hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide todos los campos requeridos antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - En caso de error de validación, revise los mensajes detallados en la respuesta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelId:
 *                 type: string
 *                 description: Identificador único del hotel.
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
 *       '201':
 *         description: Habitación registrada exitosamente.
 *       '400':
 *         description: Ya existe una habitación con el mismo número en este hotel.
 *       '404':
 *         description: Hotel no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/registerRoom', RoomAdminValidator, registerRoom);

/**
 * @swagger
 * /room/admin/{roomId}:
 *   delete:
 *     tags:
 *       - Room
 *     summary: Eliminar una habitación (Administrador)
 *     description: |
 *         Permite a un administrador eliminar una habitación específica.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Verifique que el identificador enviado sea correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Evite realizar múltiples eliminaciones innecesarias para optimizar el rendimiento.
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
 *       '404':
 *         description: Habitación no encontrada.
 *       '500':
 *         description: Error interno del servidor.
 */
router.delete('/deleteRoom/:roomId', RoomAdminValidator, deleteRoom);

/**
 * @swagger
 * /room/adminUpdate/{roomId}:
 *   put:
 *     tags:
 *       - Room
 *     summary: Actualizar una habitación (Administrador)
 *     description: |
 *         Permite a un administrador actualizar los datos de una habitación específica.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Actualice solo los campos necesarios para optimizar el rendimiento.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
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
 *         description: Habitación actualizada exitosamente.
 *       '404':
 *         description: Habitación no encontrada.
 *       '500':
 *         description: Error interno del servidor.
 */
router.put('/updateRoom/:roomId', RoomAdminValidator, updateRoom);

/**
 * @swagger
 * /room/getRoom:
 *   get:
 *     tags:
 *       - Room
 *     summary: Obtener información de una habitación
 *     description: |
 *         Permite obtener información detallada de una habitación específica.
 *         
 *         **Roles permitidos:** Público (sin autenticación)
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el identificador de la habitación sea correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     responses:
 *       '200':
 *         description: Información de la habitación obtenida exitosamente.
 *       '404':
 *         description: Habitación no encontrada.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/getRoom/', getRoom)

export default router

