import { Router } from 'express';
import { createEvent, updateEvent, deleteEvent, listEvent, listEventUser } from './event.controller.js';
import { createEventValidator, editDeleteEventValidator, DeleteEventValidator, listEventValidator } from '../middlewares/event-validators.js';

const router = Router();

/**
 * @swagger
 * /event/createEvent:
 *   post:
 *     tags:
 *       - Event
 *     summary: Crear un nuevo evento
 *     description: |
 *         Permite crear un nuevo evento en el sistema.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide todos los campos requeridos antes de enviar la solicitud.
 *         - No haga referencia a ningún modelo en la petición.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotelId:
 *                 type: string
 *                 description: ID del hotel asociado al evento.
 *               nombre:
 *                 type: string
 *                 description: Nombre del evento.
 *               descripcion:
 *                 type: string
 *                 description: Descripción del evento.
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha del evento (YYYY-MM-DD).
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de servicios asociados al evento.
 *               hotel:
 *                 type: string
 *                 description: ID del hotel (debe ser un ID válido).
 *           example:
 *             hotelId: "663b1c2f4b2e2a0012a3b456"
 *             nombre: "Conferencia de Tecnología"
 *             descripcion: "Evento sobre innovación tecnológica."
 *             fecha: "2025-06-15"
 *             servicios: ["WiFi", "Coffe Break"]
 *             hotel: "663b1c2f4b2e2a0012a3b456"
 *     responses:
 *       200:
 *         description: Evento creado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: "Evento creado con exito"
 *               event:
 *                 nombre: "Conferencia de Tecnología"
 *                 descripcion: "Evento sobre innovación tecnológica."
 *                 fecha: "2025-06-15"
 *                 servicios: ["WiFi", "Coffe Break"]
 *                 hotel: "663b1c2f4b2e2a0012a3b456"
 *       400:
 *         description: Error al crear el evento (por ejemplo, ya existe un evento para esa fecha).
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al crear el evento"
 *               error: "Ya existe un evento para esta fecha"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al crear evento"
 *               error: "Descripción del error"
 */
router.post('/createEvent', createEventValidator, createEvent);

/**
 * @swagger
 * /event/editarEvento/{uid}:
 *   put:
 *     tags:
 *       - Event
 *     summary: Actualizar un evento existente
 *     description: |
 *         Permite actualizar los datos de un evento existente.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Envíe solo los campos que desea actualizar.
 *         - No haga referencia a ningún modelo en la petición.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     parameters:
 *       - in: path
 *         name: uid
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
 *                 description: Nuevo nombre del evento.
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción del evento.
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha del evento (YYYY-MM-DD).
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de servicios asociados al evento.
 *           example:
 *             nombre: "Conferencia de Innovación"
 *             descripcion: "Evento actualizado sobre innovación."
 *             fecha: "2025-07-01"
 *             servicios: ["WiFi", "Almuerzo"]
 *     responses:
 *       200:
 *         description: Evento actualizado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: "Evento actualizado con exito"
 *               event:
 *                 nombre: "Conferencia de Innovación"
 *                 descripcion: "Evento actualizado sobre innovación."
 *                 fecha: "2025-07-01"
 *                 servicios: ["WiFi", "Almuerzo"]
 *       400:
 *         description: Error al actualizar el evento (por ejemplo, ya existe un evento para esa fecha o evento no encontrado).
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al actualizar el evento"
 *               error: "Ya existe un evento para esta fecha"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al actualizar evento"
 *               error: "Descripción del error"
 */
router.put('/editarEvento/:uid', editDeleteEventValidator, updateEvent);

/**
 * @swagger
 * /event/deleteEvent/{uid}:
 *   delete:
 *     tags:
 *       - Event
 *     summary: Eliminar (cancelar) un evento
 *     description: |
 *         Permite cancelar (eliminar lógicamente) un evento existente.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Verifique que el identificador del evento sea correcto.
 *         - No haga referencia a ningún modelo en la petición.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del evento.
 *     responses:
 *       200:
 *         description: Evento cancelado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: "Evento ah sido cancelado con exito "
 *               event:
 *                 nombre: "Conferencia de Tecnología"
 *                 descripcion: "Evento sobre innovación tecnológica."
 *                 fecha: "2025-06-15"
 *                 servicios: ["WiFi", "Coffe Break"]
 *       400:
 *         description: Error al eliminar el evento (evento no encontrado).
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al eliminar el evento"
 *               error: "Evento no encontrado"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al eliminar el evento"
 *               error: "Descripción del error"
 */
router.delete('/deleteEvent/:uid', DeleteEventValidator, deleteEvent);

/**
 * @swagger
 * /event/listEvent/:
 *   get:
 *     tags:
 *       - Event
 *     summary: Listar todos los eventos
 *     description: |
 *         Obtiene la lista completa de todos los eventos registrados en el sistema, sin filtrar por hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros o paginación si espera una gran cantidad de eventos.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     responses:
 *       '200':
 *         description: Lista de todos los eventos obtenida exitosamente.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/listEvent/', listEvent);
/**
 * @swagger
 * /event/listEventUser/:
 *   get:
 *     tags:
 *       - Event
 *     summary: Listar eventos creados por usuarios con rol USER_ROLE
 *     description: |
 *         Obtiene la lista de todos los eventos registrados por usuarios con el rol USER_ROLE.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros o paginación si espera una gran cantidad de eventos.
 *         - No haga referencia a ningún modelo en la petición.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     responses:
 *       200:
 *         description: Lista de eventos de usuarios obtenida exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               events:
 *                 - nombre: "Conferencia de Tecnología"
 *                   descripcion: "Evento sobre innovación tecnológica."
 *                   fecha: "2025-06-15"
 *                   servicios: ["WiFi", "Coffe Break"]
 *       404:
 *         description: No se encontraron eventos.
 *         content:
 *           application/json:
 *             example:
 *               message: "Events not found"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               succes: false
 *               message: "Error al obtener los eventos"
 *               error: "Descripción del error"
 */
router.get('/listEventUser/', listEventValidator, listEventUser)

export default router;
