import { Router } from 'express';
import { createEvent, updateEvent, deleteEvent, getEventsByHotel } from './event.controller.js';
import { createEventValidator, editDeleteEventValidator, DeleteEventValidator } from '../middlewares/event-validators.js';

const router = Router();


/**
 * @swagger
 * /event/create:
 *   post:
 *     tags:
 *       - Event
 *     summary: Crear un nuevo evento
 *     description: |
 *         Permite crear un nuevo evento asociado a un hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - En caso de errores de validación, revise los mensajes detallados en la respuesta.
 *         - Para optimizar el rendimiento, evite enviar grandes volúmenes de datos innecesarios.
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
 *               nombre:
 *                 type: string
 *                 description: Nombre del evento.
 *               descripcion:
 *                 type: string
 *                 description: Descripción del evento.
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha del evento.
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de identificadores de servicios asociados.
 *           example:
 *             hotelId: "609bda8f1c4ae34d5c8f9b2d"
 *             nombre: "Conferencia de Negocios"
 *             descripcion: "Evento enfocado en estrategias de negocios."
 *             fecha: "2025-05-15"
 *             servicios: ["609bda8f1c4ae34d5c8f9b2b", "609bda8f1c4ae34d5c8f9b2c"]
 *     responses:
 *       '201':
 *         description: Evento creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Evento creado con éxito
 *       '404':
 *         description: Hotel no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hotel no encontrado
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear evento
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/create', createEventValidator, createEvent);

/**
 * @swagger
 * /event/edit/{hotelId}/{eventId}:
 *   put:
 *     tags:
 *       - Event
 *     summary: Actualizar un evento
 *     description: |
 *         Permite actualizar los datos de un evento existente.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - En caso de errores de validación, revise los mensajes detallados en la respuesta.
 *         - Para optimizar el rendimiento, actualice solo los campos necesarios.
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del evento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del evento.
 *               descripcion:
 *                 type: string
 *                 description: Descripción del evento.
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha del evento.
 *           example:
 *             nombre: "Conferencia de Negocios"
 *             descripcion: "Evento enfocado en estrategias de negocios."
 *             fecha: "2025-05-15"
 *     responses:
 *       '200':
 *         description: Evento actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Evento actualizado
 *       '404':
 *         description: Evento no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Evento no encontrado en este hotel
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al actualizar evento
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.put('/edit/:hotelId/:eventId', editDeleteEventValidator, updateEvent);

/**
 * @swagger
 * /event/delete/{hotelId}/{eventId}:
 *   delete:
 *     tags:
 *       - Event
 *     summary: Eliminar un evento
 *     description: |
 *         Permite eliminar un evento asociado a un hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Verifique que los identificadores enviados sean correctos.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - En caso de errores de validación, revise los mensajes detallados en la respuesta.
 *         - Para optimizar el rendimiento, evite realizar múltiples eliminaciones innecesarias.
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del evento.
 *     responses:
 *       '200':
 *         description: Evento eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Evento eliminado
 *       '404':
 *         description: Evento no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Evento no encontrado en este hotel
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al eliminar evento
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.delete('/delete/:hotelId/:eventId', DeleteEventValidator, deleteEvent);

/**
 * @swagger
 * /event/hotel/{hotelId}:
 *   get:
 *     tags:
 *       - Event
 *     summary: Obtener eventos por hotel
 *     description: |
 *         Permite obtener todos los eventos asociados a un hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros o paginación si espera una gran cantidad de eventos.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Valide que el identificador del hotel sea correcto.
 *         - Para optimizar el rendimiento, solicite solo los datos necesarios.
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *     responses:
 *       '200':
 *         description: Lista de eventos obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: Nombre del evento.
 *                   descripcion:
 *                     type: string
 *                     description: Descripción del evento.
 *                   fecha:
 *                     type: string
 *                     format: date
 *                     description: Fecha del evento.
 *       '404':
 *         description: No se encontraron eventos para el hotel indicado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontraron eventos para este hotel
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener eventos
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/hotel/:hotelId', getEventsByHotel);

export default router;
