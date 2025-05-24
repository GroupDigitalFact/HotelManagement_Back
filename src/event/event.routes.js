import { Router } from 'express';
import { createEventUserValidator, createEventValidator, DeleteEventValidator, editDeleteEventValidator, getEventByUserValidator } from '../middlewares/event-validators.js';
import { createEvent, createEventUser, deleteEvent, listEvent, listTodayEvents, listUserEvents, updateEvent } from './event.controller.js';

const router = Router();
/**
 * @swagger
 * /event/createEvent:
 *   post:
 *     tags:
 *       - Event
 *     summary: Crear un evento para un usuario específico
 *     description: |
 *         Permite crear un evento para un usuario en un hotel determinado.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Asegúrese de enviar todos los campos requeridos: nombre, descripcion, fecha, hotel y user.
 *         - Verifique que el hotel y usuario existan y sean válidos.
 *         - Los servicios deben ser IDs válidos y activos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, descripcion, fecha, hotel, user]
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del evento.
 *               descripcion:
 *                 type: string
 *                 description: Descripción del evento.
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha del evento (YYYY-MM-DDTHH:mm:ss.sssZ).
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de IDs de servicios asociados al evento.
 *               hotel:
 *                 type: string
 *                 description: ID del hotel.
 *               user:
 *                 type: string
 *                 description: ID del usuario.
 *           example:
 *             nombre: "Fiesta de Graduación"
 *             descripcion: "Evento de graduación universitaria"
 *             fecha: "2025-06-15T18:00:00.000Z"
 *             servicios: ["6650e1f2c8b4b2a1d4e8a123"]
 *             hotel: "6650e1f2c8b4b2a1d4e8a456"
 *             user: "6650e1f2c8b4b2a1d4e8a789"
 *     responses:
 *       200:
 *         description: Evento creado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: "Evento creado con éxito"
 *               event:
 *                 nombre: "Fiesta de Graduación"
 *                 descripcion: "Evento de graduación universitaria"
 *                 fecha: "2025-06-15T18:00:00.000Z"
 *                 servicios: ["6650e1f2c8b4b2a1d4e8a123"]
 *                 hotel: "6650e1f2c8b4b2a1d4e8a456"
 *                 user: "6650e1f2c8b4b2a1d4e8a789"
 *                 totalPrice: 500
 *                 status: true
 *       400:
 *         description: Error de validación o sin salones disponibles.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al crear el evento"
 *               error: "El usuario es requerido para crear un evento"
 *       404:
 *         description: Hotel no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al crear el evento"
 *               error: "Hotel no encontrado"
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
 *         - No puede cambiar la fecha a una ya ocupada por otro evento.
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
 *                 format: date-time
 *                 description: Nueva fecha del evento (YYYY-MM-DDTHH:mm:ss.sssZ).
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de servicios asociados al evento.
 *           example:
 *             nombre: "Conferencia de Innovación"
 *             descripcion: "Evento actualizado sobre innovación."
 *             fecha: "2025-07-01T18:00:00.000Z"
 *             servicios: ["6650e1f2c8b4b2a1d4e8a123"]
 *     responses:
 *       200:
 *         description: Evento actualizado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: "Evento actualizado con éxito"
 *               event:
 *                 nombre: "Conferencia de Innovación"
 *                 descripcion: "Evento actualizado sobre innovación."
 *                 fecha: "2025-07-01T18:00:00.000Z"
 *                 servicios: ["6650e1f2c8b4b2a1d4e8a123"]
 *       400:
 *         description: Error al actualizar el evento (por ejemplo, ya existe un evento para esa fecha).
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al actualizar el evento"
 *               error: "Ya existe un evento para esta fecha"
 *       404:
 *         description: Evento no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Evento no encontrado"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error en el servidor al actualizar evento"
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
 *         - El evento no se elimina físicamente, solo se marca como inactivo.
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
 *                 fecha: "2025-06-15T18:00:00.000Z"
 *                 servicios: ["6650e1f2c8b4b2a1d4e8a123"]
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
 *         Obtiene la lista completa de todos los eventos activos registrados en el sistema.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros o paginación si espera una gran cantidad de eventos.
 *     responses:
 *       200:
 *         description: Lista de todos los eventos obtenida exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               events: [
 *                 {
 *                   nombre: "Evento 1",
 *                   descripcion: "Descripción evento 1",
 *                   fecha: "2025-06-10T18:00:00.000Z",
 *                   servicios: [],
 *                   hotel: { name: "Hotel Central" },
 *                   user: { email: "usuario@email.com" },
 *                   status: true
 *                 }
 *               ]
 *       404:
 *         description: No hay eventos.
 *         content:
 *           application/json:
 *             example:
 *               message: "Events not found"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al obtener los eventos"
 *               error: "Descripción del error"
 */
router.get('/listEvent/', listEvent);

/**
 * @swagger
 * /event/eventByUser:
 *   get:
 *     tags:
 *       - Event
 *     summary: Listar eventos del usuario autenticado
 *     description: |
 *         Obtiene los eventos activos del usuario autenticado.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Úselo para mostrar el historial de eventos del usuario logueado.
 *     responses:
 *       200:
 *         description: Lista de eventos del usuario.
 *         content:
 *           application/json:
 *             example:
 *               message: "Eventos encontrados"
 *               events: [
 *                 {
 *                   nombre: "Evento Usuario",
 *                   descripcion: "Evento personal",
 *                   fecha: "2025-06-20T18:00:00.000Z",
 *                   servicios: [],
 *                   hotel: { name: "Hotel Central" },
 *                   status: true
 *                 }
 *               ]
 *       404:
 *         description: No tienes eventos registrados.
 *         content:
 *           application/json:
 *             example:
 *               message: "No tienes eventos registrados."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al obtener eventos del usuario"
 *               error: "Descripción del error"
 */
router.get('/eventByUser', getEventByUserValidator, listUserEvents);

/**
 * @swagger
 * /event/registerEventUser:
 *   post:
 *     tags:
 *       - Event
 *     summary: Registrar evento por usuario autenticado
 *     description: |
 *         Permite a un usuario crear un evento para sí mismo.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - El usuario autenticado será asignado automáticamente al evento.
 *         - Verifique que el hotel exista y tenga disponibilidad en la fecha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, descripcion, fecha, hotel]
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del evento.
 *               descripcion:
 *                 type: string
 *                 description: Descripción del evento.
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha del evento (YYYY-MM-DDTHH:mm:ss.sssZ).
 *               servicios:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de IDs de servicios asociados al evento.
 *               hotel:
 *                 type: string
 *                 description: ID del hotel.
 *           example:
 *             nombre: "Cumpleaños"
 *             descripcion: "Fiesta de cumpleaños"
 *             fecha: "2025-07-01T20:00:00.000Z"
 *             servicios: ["6650e1f2c8b4b2a1d4e8a123"]
 *             hotel: "6650e1f2c8b4b2a1d4e8a456"
 *     responses:
 *       200:
 *         description: Evento creado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: "Evento creado con éxito"
 *               event:
 *                 nombre: "Cumpleaños"
 *                 descripcion: "Fiesta de cumpleaños"
 *                 fecha: "2025-07-01T20:00:00.000Z"
 *                 servicios: ["6650e1f2c8b4b2a1d4e8a123"]
 *                 hotel: "6650e1f2c8b4b2a1d4e8a456"
 *                 user: "6650e1f2c8b4b2a1d4e8a789"
 *                 totalPrice: 400
 *                 status: true
 *       400:
 *         description: Hotel no proporcionado o no encontrado, o sin salones disponibles.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al crear el evento"
 *               error: "El hotel es requerido para crear un evento"
 *       404:
 *         description: Hotel no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al crear el evento"
 *               error: "Hotel no encontrado"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al crear evento"
 *               error: "Descripción del error"
 */
router.post('/registerEventUser', createEventUserValidator, createEventUser);

/**
 * @swagger
 * /event/listEventToday:
 *   get:
 *     tags:
 *       - Event
 *     summary: Listar eventos del día actual
 *     description: |
 *         Obtiene todos los eventos activos programados para el día actual.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Útil para dashboards diarios o reportes de operaciones.
 *     responses:
 *       200:
 *         description: Lista de eventos de hoy.
 *         content:
 *           application/json:
 *             example:
 *               events: [
 *                 {
 *                   nombre: "Evento de Hoy",
 *                   descripcion: "Evento especial",
 *                   fecha: "2025-06-23T18:00:00.000Z",
 *                   servicios: [],
 *                   hotel: { name: "Hotel Central" },
 *                   user: { email: "usuario@email.com" },
 *                   status: true
 *                 }
 *               ]
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al obtener los eventos de hoy"
 *               error: "Descripción del error"
 */
router.get('/listEventToday', getEventByUserValidator, listTodayEvents);
export default router;
