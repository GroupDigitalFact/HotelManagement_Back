import { Router } from "express";
import { reserveRoom, cancelReservation, MyReservations, ReservationAdmin,UserReservationsAdminHotel, listarReservation, cancelReservationAdmin, createReservationRoom, editReservation } from "./reservation.controller.js";
import { reservationValidator, cancelReservationValidator, UserReservationValidator, ManagerReservationValidator, AdminReservationValidator, listReservationValidator, ReservationValidator } from "../middlewares/reservation-validators.js";

const router = Router();

/**
 * @swagger
 * /reservation/activas:
 *   get:
 *     tags:
 *       - Reservation
 *     summary: Listar todas las reservaciones activas
 *     description: |
 *         Permite a un administrador obtener todas las reservaciones activas del sistema.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros o paginación si espera una gran cantidad de reservaciones.
 *         - Asegúrese de enviar el token de autenticación correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     responses:
 *       '200':
 *         description: Lista de reservaciones activas obtenida exitosamente.
 *       '401':
 *         description: Token no proporcionado o inválido.
 *       '403':
 *         description: No autorizado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/activas', listReservationValidator,listarReservation);

/**
 * @swagger
 * /reservation/cancelar:
 *   put:
 *     tags:
 *       - Reservation
 *     summary: Cancelar una reservación (admin)
 *     description: |
 *         Permite a un administrador cancelar una reservación activa.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el id de la reservación sea válido antes de enviar la solicitud.
 *         - Solicite solo la cancelación de reservaciones activas.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID de la reservación a cancelar.
 *           example:
 *             id: "6647c1e7f2b5a2c1d8e4b123"
 *     responses:
 *       '200':
 *         description: Reservación cancelada correctamente.
 *       '400':
 *         description: Solo se pueden cancelar reservaciones activas.
 *       '404':
 *         description: Reservación no encontrada.
 *       '401':
 *         description: Token no proporcionado o inválido.
 *       '500':
 *         description: Error interno del servidor.
 */
router.put('/cancelar', ReservationValidator, cancelReservationAdmin);

/**
 * @swagger
 * /reservation/createAdmin:
 *   post:
 *     tags:
 *       - Reservation
 *     summary: Crear una reservación como administrador
 *     description: |
 *         Permite a un administrador o administrador de hotel crear una reservación para un usuario.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Verifique que el usuario, hotel y habitación existan.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del cliente.
 *               hotelName:
 *                 type: string
 *                 description: Nombre del hotel.
 *               numeroCuarto:
 *                 type: string
 *                 description: Número de la habitación.
 *               dateEntry:
 *                 type: string
 *                 format: date
 *                 description: Fecha de entrada.
 *               departureDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de salida.
 *               cardNumber:
 *                 type: string
 *                 description: Número de tarjeta.
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
 *                 description: Lista de nombres de servicios extra.
 *           example:
 *             username: "usuario1"
 *             hotelName: "Hotel Central"
 *             numeroCuarto: "101"
 *             dateEntry: "2025-06-01"
 *             departureDate: "2025-06-05"
 *             cardNumber: "1234567890123456"
 *             CVV: "123"
 *             expired: "2027-12-31"
 *             extraServices: ["Desayuno", "Spa"]
 *     responses:
 *       '201':
 *         description: Reservación creada correctamente.
 *       '400':
 *         description: Error en los datos proporcionados o habitación ya reservada.
 *       '404':
 *         description: Usuario, hotel o habitación no encontrados.
 *       '401':
 *         description: Token no proporcionado o inválido.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/createAdmin',ReservationValidator, createReservationRoom)

/**
 * @swagger
 * /reservation/modific:
 *   put:
 *     tags:
 *       - Reservation
 *     summary: Editar una reservación existente
 *     description: |
 *         Permite a un administrador o administrador de hotel editar una reservación existente.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Verifique que la reservación, usuario, hotel y habitación existan.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idreservation:
 *                 type: string
 *                 description: ID de la reservación a editar.
 *               username:
 *                 type: string
 *                 description: Nombre de usuario del cliente.
 *               hotelName:
 *                 type: string
 *                 description: Nombre del hotel.
 *               numeroCuarto:
 *                 type: string
 *                 description: Número de la habitación.
 *               dateEntry:
 *                 type: string
 *                 format: date
 *                 description: Fecha de entrada.
 *               departureDate:
 *                 type: string
 *                 format: date
 *                 description: Fecha de salida.
 *               cardNumber:
 *                 type: string
 *                 description: Número de tarjeta.
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
 *                 description: Lista de nombres de servicios extra.
 *           example:
 *             idreservation: "6647c1e7f2b5a2c1d8e4b123"
 *             username: "usuario1"
 *             hotelName: "Hotel Central"
 *             numeroCuarto: "101"
 *             dateEntry: "2025-06-01"
 *             departureDate: "2025-06-05"
 *             cardNumber: "1234567890123456"
 *             CVV: "123"
 *             expired: "2027-12-31"
 *             extraServices: ["Desayuno", "Spa"]
 *     responses:
 *       '200':
 *         description: Reservación actualizada correctamente.
 *       '400':
 *         description: Error en los datos proporcionados o habitación ya reservada.
 *       '404':
 *         description: Reservación, usuario, hotel o habitación no encontrados.
 *       '401':
 *         description: Token no proporcionado o inválido.
 *       '500':
 *         description: Error interno del servidor.
 */
router.put('/modific', ReservationValidator, editReservation);

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
