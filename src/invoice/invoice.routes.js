import { Router } from "express";
import {generateInvoicePDF, generateInvoiceAdmin, ListInvoicesByHotelId, InvoicesByUserId, InvoicesForHotelAdmin, UserInvoicesForHotelAdmin} from "./invoice.controller.js";
import { invoiceValidator, invoiceAdminsValidator, invoiceListHotelValidator, invoiceListUserValidator } from "../middlewares/invoice-validators.js";

const router = Router();

router.get('/generate/:reservationId',invoiceValidator,generateInvoicePDF);
router.get('/generateAdmin/:reservationId', invoiceAdminsValidator, generateInvoiceAdmin);
router.get('/hotel/:hotelId', invoiceListHotelValidator, ListInvoicesByHotelId);
router.get('/usuario/:userId', invoiceListUserValidator, InvoicesByUserId);
router.get('/hotelAdmin/:hotelId', invoiceListHotelValidator, InvoicesForHotelAdmin);
router.get('/usuarioHotelAdmin/:userUid', invoiceListUserValidator, UserInvoicesForHotelAdmin);


export default router

/**
 * @swagger
 * tags:
 *   - name: Invoice
 *     description: Endpoints relacionados con la gestión de facturas.
 * 
 * paths:
 *   /invoice/generate/{reservationId}:
 *     get:
 *       tags:
 *         - Invoice
 *       summary: Generar factura en PDF
 *       description: |
 *         Genera una factura en formato PDF para una reservación específica.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE, USER_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el reservationId sea válido antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Solicite solo las facturas necesarias para evitar sobrecargar el servidor.
 *         - Asegúrese de tener el token de autenticación correcto.
 *       parameters:
 *         - in: path
 *           name: reservationId
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único de la reservación.
 *       responses:
 *         '200':
 *           description: Factura generada exitosamente.
 *           content:
 *             application/pdf:
 *               schema:
 *                 type: string
 *                 format: binary
 *         '401':
 *           description: Token no proporcionado o inválido.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Token no proporcionado
 *         '403':
 *           description: No tienes permiso para generar la factura.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: No tienes permiso para generar la factura de esta reservación
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
 *                     example: Error al generar la factura
 *   /invoice/generateAdmin/{reservationId}:
 *     get:
 *       tags:
 *         - Invoice
 *       summary: Generar factura en PDF (Administrador)
 *       description: |
 *         Genera una factura en formato PDF para una reservación específica, accesible por administradores.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el reservationId sea válido antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Solicite solo las facturas necesarias para evitar sobrecargar el servidor.
 *         - Asegúrese de tener el token de autenticación correcto.
 *       parameters:
 *         - in: path
 *           name: reservationId
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único de la reservación.
 *       responses:
 *         '200':
 *           description: Factura generada exitosamente.
 *           content:
 *             application/pdf:
 *               schema:
 *                 type: string
 *                 format: binary
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
 *                     example: Error al generar la factura
 *   /invoice/hotel/{hotelId}:
 *     get:
 *       tags:
 *         - Invoice
 *       summary: Listar facturas por hotel
 *       description: |
 *         Obtiene todas las facturas asociadas a un hotel específico.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el hotelId sea válido antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Utilice filtros o paginación si espera una gran cantidad de facturas.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *       parameters:
 *         - in: path
 *           name: hotelId
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del hotel.
 *       responses:
 *         '200':
 *           description: Lista de facturas obtenida exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Invoice'
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al obtener las facturas del hotel
 *   /invoice/usuario/{userId}:
 *     get:
 *       tags:
 *         - Invoice
 *       summary: Listar facturas por usuario
 *       description: |
 *         Obtiene todas las facturas asociadas a un usuario específico.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el userId sea válido antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Utilice filtros o paginación si espera una gran cantidad de facturas.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del usuario.
 *       responses:
 *         '200':
 *           description: Lista de facturas obtenida exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Invoice'
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al obtener las facturas del usuario
 *   /invoice/hotelAdmin/{hotelId}:
 *     get:
 *       tags:
 *         - Invoice
 *       summary: Listar facturas para administradores de hotel
 *       description: |
 *         Obtiene todas las facturas asociadas a un hotel, accesible solo por administradores del hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el hotelId sea válido antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Utilice filtros o paginación si espera una gran cantidad de facturas.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *       parameters:
 *         - in: path
 *           name: hotelId
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del hotel.
 *       responses:
 *         '200':
 *           description: Lista de facturas obtenida exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Invoice'
 *         '403':
 *           description: No tienes permiso para ver las facturas de este hotel.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: No tienes permiso para ver las facturas de este hotel
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al listar facturas del hotel
 *   /invoice/usuarioHotelAdmin/{userUid}:
 *     get:
 *       tags:
 *         - Invoice
 *       summary: Listar facturas de un usuario para administradores de hotel
 *       description: |
 *         Obtiene todas las facturas asociadas a un usuario, accesible solo por administradores del hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el userUid sea válido antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Utilice filtros o paginación si espera una gran cantidad de facturas.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *       parameters:
 *         - in: path
 *           name: userUid
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del usuario.
 *       responses:
 *         '200':
 *           description: Lista de facturas obtenida exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Invoice'
 *         '403':
 *           description: No tienes permiso para ver las facturas de este usuario.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: No tienes permiso para ver las facturas de este usuario
 *         '404':
 *           description: El usuario no tiene reservaciones.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Este usuario no tiene reservaciones
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error interno del servidor
 */