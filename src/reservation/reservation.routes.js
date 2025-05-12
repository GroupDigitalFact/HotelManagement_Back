import { Router } from "express";
import { reserveRoom, cancelReservation, MyReservations, ReservationAdmin,UserReservationsAdminHotel } from "./reservation.controller.js";
import { reservationValidator, cancelReservationValidator, UserReservationValidator, ManagerReservationValidator, AdminReservationValidator } from "../middlewares/reservation-validators.js";

const router = Router();

router.post('/Reserve', reservationValidator, reserveRoom);

router.put('/Cancel/:reservationId', cancelReservationValidator, cancelReservation);

router.get('/my-reservations', UserReservationValidator, MyReservations);

router.get('/user-reservations/:identifier', AdminReservationValidator, ReservationAdmin);

router.get('/admin/hotel-reservations/:identifier', ManagerReservationValidator, UserReservationsAdminHotel);


export default router

/**
 * @swagger
 * tags:
 *   - name: Reservation
 *     description: Endpoints relacionados con la gestión de reservaciones.
 * 
 * paths:
 *   /reservation/Reserve:
 *     post:
 *       tags:
 *         - Reservation
 *       summary: Crear una nueva reservación
 *       description: Permite realizar una reservación para una habitación específica.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomId:
 *                   type: string
 *                   description: Identificador único de la habitación.
 *                   example: 609bda8f1c4ae34d5c8f9b2c
 *                 dateEntry:
 *                   type: string
 *                   format: date
 *                   description: Fecha de entrada de la reservación.
 *                   example: 2025-05-15
 *                 departureDate:
 *                   type: string
 *                   format: date
 *                   description: Fecha de salida de la reservación.
 *                   example: 2025-05-20
 *                 cardNumber:
 *                   type: string
 *                   description: Número de tarjeta utilizado para la reservación.
 *                   example: 1234567812345678
 *                 CVV:
 *                   type: string
 *                   description: Código de seguridad de la tarjeta.
 *                   example: 123
 *                 expired:
 *                   type: string
 *                   format: date
 *                   description: Fecha de expiración de la tarjeta.
 *                   example: 2025-12-31
 *                 extraServices:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Lista de identificadores de servicios extra asociados.
 *                   example: ["609bda8f1c4ae34d5c8f9b2d", "609bda8f1c4ae34d5c8f9b2e"]
 *       responses:
 *         '201':
 *           description: Reservación creada exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Reservación realizada correctamente
 *                   reservation:
 *                     $ref: '#/components/schemas/Reservation'
 *         '400':
 *           description: Error en los datos proporcionados.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: La habitación ya está reservada para las fechas seleccionadas
 *         '404':
 *           description: Habitación o servicios extra no encontrados.
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
 *                     example: Error al realizar la reservación
 *   /reservation/Cancel/{reservationId}:
 *     put:
 *       tags:
 *         - Reservation
 *       summary: Cancelar una reservación
 *       description: Permite cancelar una reservación activa.
 *       parameters:
 *         - in: path
 *           name: reservationId
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único de la reservación.
 *       responses:
 *         '200':
 *           description: Reservación cancelada exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Reservación cancelada exitosamente
 *         '400':
 *           description: La reservación no puede ser cancelada.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Solo se pueden cancelar reservaciones activas
 *         '404':
 *           description: Reservación no encontrada.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Reservación no encontrada
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al cancelar la reservación
 *   /reservation/my-reservations:
 *     get:
 *       tags:
 *         - Reservation
 *       summary: Obtener mis reservaciones
 *       description: Permite al usuario autenticado obtener todas sus reservaciones.
 *       responses:
 *         '200':
 *           description: Lista de reservaciones obtenida exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Reservation'
 *         '401':
 *           description: Token no proporcionado.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Token no proporcionado
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al obtener las reservaciones
 *   /reservation/user-reservations/{identifier}:
 *     get:
 *       tags:
 *         - Reservation
 *       summary: Obtener reservaciones de un usuario
 *       description: Permite a un administrador obtener todas las reservaciones de un usuario específico.
 *       parameters:
 *         - in: path
 *           name: identifier
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del usuario.
 *       responses:
 *         '200':
 *           description: Lista de reservaciones obtenida exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Reservation'
 *         '404':
 *           description: Usuario no encontrado o sin reservaciones.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Usuario no encontrado o sin reservaciones
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al obtener las reservaciones del usuario
 *   /reservation/admin/hotel-reservations/{identifier}:
 *     get:
 *       tags:
 *         - Reservation
 *       summary: Obtener reservaciones de un hotel
 *       description: Permite a un administrador de hotel obtener todas las reservaciones asociadas a su hotel.
 *       parameters:
 *         - in: path
 *           name: identifier
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del hotel.
 *       responses:
 *         '200':
 *           description: Lista de reservaciones obtenida exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Reservation'
 *         '404':
 *           description: Hotel no encontrado o sin reservaciones.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Hotel no encontrado o sin reservaciones
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al obtener las reservaciones del hotel
 */