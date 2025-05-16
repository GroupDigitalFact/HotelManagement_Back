import { Router } from "express";
import { reserveRoom, cancelReservation, MyReservations, ReservationAdmin,UserReservationsAdminHotel } from "./reservation.controller.js";
import { reservationValidator, cancelReservationValidator, UserReservationValidator, ManagerReservationValidator, AdminReservationValidator } from "../middlewares/reservation-validators.js";

const router = Router();


/**
 * @swagger
 * /reservation/Reserve:
 *   post:
 *     tags:
 *       - Reservation
 *     summary: Crear una nueva reservación
 *     description: |
 *         Permite realizar una reservación para una habitación específica.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE, USER_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Utilice filtros adecuados para evitar reservas duplicadas.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *                 description: Identificador único de la habitación.
 *               dateEntry:
 *                 type: string
 *                 format: date
 *                 description: Fecha de entrada de la reservación.
 *               departureDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de salida de la reservación.
 *               cardNumber:
 *                 type: string
 *                 description: Número de tarjeta utilizado para la reservación.
 *               CVV:
 *                 type: string
 *                 description: Código de seguridad de la tarjeta.
 *               expired:
 *                 type: string
 *                 format: date
 *                 description: Fecha de expiración de la tarjeta.
 *               extraServices:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de identificadores de servicios extra asociados.
 *     responses:
 *       '201':
 *         description: Reservación creada exitosamente.
 *       '400':
 *         description: Error en los datos proporcionados.
 *       '404':
 *         description: Habitación o servicios extra no encontrados.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/Reserve', reservationValidator, reserveRoom);


/**
 * @swagger
 * /reservation/Cancel/{reservationId}:
 *   put:
 *     tags:
 *       - Reservation
 *     summary: Cancelar una reservación
 *     description: |
 *         Permite cancelar una reservación activa.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE, USER_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el reservationId sea válido antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Solicite solo la cancelación de reservaciones activas.
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único de la reservación.
 *     responses:
 *       '200':
 *         description: Reservación cancelada exitosamente.
 *       '400':
 *         description: La reservación no puede ser cancelada.
 *       '404':
 *         description: Reservación no encontrada.
 *       '500':
 *         description: Error interno del servidor.
 */
router.put('/Cancel/:reservationId', cancelReservationValidator, cancelReservation);

/**
 * @swagger
 * /reservation/my-reservations:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: Obtener mis reservaciones
 *     description: |
 *         Permite al usuario autenticado obtener todas sus reservaciones, estas se consiguen buscando sus reservaciones a partir del id obtenido de su token.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE, USER_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Asegúrese de enviar el token de autenticación correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Utilice filtros o paginación si espera una gran cantidad de reservaciones.
 *     responses:
 *       '200':
 *         description: Lista de reservaciones obtenida exitosamente.
 *       '401':
 *         description: Token no proporcionado.
 *       '500':
 *         description: Error interno del servidor.
 */

router.get('/my-reservations', UserReservationValidator, MyReservations);

/**
 * @swagger
 * /reservation/user-reservations/{identifier}:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: Obtener reservaciones de un usuario
 *     description: |
 *         Permite a un administrador obtener todas las reservaciones de un usuario específico.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el identifier sea válido antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Utilice filtros o paginación si espera una gran cantidad de reservaciones.
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del usuario.
 *     responses:
 *       '200':
 *         description: Lista de reservaciones obtenida exitosamente.
 *       '404':
 *         description: Usuario no encontrado o sin reservaciones.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/user-reservations/:identifier', AdminReservationValidator, ReservationAdmin);


/**
 * @swagger
 * /reservation/admin/hotel-reservations/{identifier}:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: Obtener reservaciones de un hotel
 *     description: |
 *         Permite a un administrador de hotel obtener todas las reservaciones asociadas a su hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el identifier sea válido antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Utilice filtros o paginación si espera una gran cantidad de reservaciones.
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *     responses:
 *       '200':
 *         description: Lista de reservaciones obtenida exitosamente.
 *       '404':
 *         description: Hotel no encontrado o sin reservaciones.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/admin/hotel-reservations/:identifier', ManagerReservationValidator, UserReservationsAdminHotel);


export default router
