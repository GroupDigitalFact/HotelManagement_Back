import { Router } from "express";
import { searchHotel, deleteHotel, searchHotelsAdmin, updateHotel, registerHotel, obtenerEstadisticasHotel, obtenerEstadisticasPorHotelId } from "./hotel.controller.js";
import { searchHotelValidator, registerHotelValidator, updateHotelValidator, searchHotelManagerValidator, delteHotelValidator, estadisticasHotelValidator, estadisticasHotelAdminValidator } from "../middlewares/hotel-validators.js";

const router = Router();

router.get("/searchHotel",  searchHotelValidator, searchHotel);
router.get("/searchHotelsAdmin", searchHotelManagerValidator, searchHotelsAdmin);
router.post("/registerHotel", registerHotelValidator, registerHotel);
router.put("/updateHotel/:id", updateHotelValidator, updateHotel);
router.delete("/deleteHotel/:id", delteHotelValidator, deleteHotel);
router.get('/estadisticasManager', estadisticasHotelValidator, obtenerEstadisticasHotel);
router.get('/estadisticasHotel/:id', estadisticasHotelAdminValidator, obtenerEstadisticasPorHotelId);

export default router;
/**
 * @swagger
 * tags:
 *   - name: Hotel
 *     description: Endpoints relacionados con la gestión de hoteles.
 * 
 * paths:
 *   /hotel/searchHotel:
 *     get:
 *       tags:
 *         - Hotel
 *       summary: Buscar hoteles
 *       description: Permite buscar hoteles según criterios como nombre, dirección, calificación o categoría.
 *       parameters:
 *         - in: query
 *           name: name
 *           schema:
 *             type: string
 *           description: Nombre del hotel.
 *         - in: query
 *           name: address
 *           schema:
 *             type: string
 *           description: Dirección del hotel.
 *         - in: query
 *           name: qualification
 *           schema:
 *             type: string
 *           description: Calificación del hotel.
 *         - in: query
 *           name: category
 *           schema:
 *             type: string
 *           description: Categoría del hotel.
 *       responses:
 *         '200':
 *           description: Lista de hoteles encontrados.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Hotel'
 *         '404':
 *           description: No se encontraron hoteles con los criterios indicados.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: No se encontraron hoteles con los criterios indicados
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al buscar hoteles
 *   /hotel/searchHotelsAdmin:
 *     get:
 *       tags:
 *         - Hotel
 *       summary: Buscar hoteles para administradores
 *       description: Permite a los administradores buscar hoteles registrados en el sistema.
 *       responses:
 *         '200':
 *           description: Lista de hoteles obtenida exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Hotel'
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al buscar hoteles para administradores
 *   /hotel/registerHotel:
 *     post:
 *       tags:
 *         - Hotel
 *       summary: Registrar un nuevo hotel
 *       description: Permite registrar un nuevo hotel en el sistema.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       responses:
 *         '201':
 *           description: Hotel registrado exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Hotel registrado correctamente
 *                   hotel:
 *                     $ref: '#/components/schemas/Hotel'
 *         '400':
 *           description: Faltan datos obligatorios.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Faltan datos obligatorios
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al registrar el hotel
 *                   error:
 *                     type: string
 *                     example: Internal server error
 *   /hotel/updateHotel/{id}:
 *     put:
 *       tags:
 *         - Hotel
 *       summary: Actualizar un hotel
 *       description: Permite actualizar los datos de un hotel existente.
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del hotel.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       responses:
 *         '200':
 *           description: Hotel actualizado exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Hotel actualizado correctamente
 *                   hotel:
 *                     $ref: '#/components/schemas/Hotel'
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
 *                     example: Error interno del servidor
 *                   error:
 *                     type: string
 *                     example: Internal server error
 *   /hotel/deleteHotel/{id}:
 *     delete:
 *       tags:
 *         - Hotel
 *       summary: Eliminar un hotel
 *       description: Permite eliminar un hotel y todas sus habitaciones y reservas asociadas.
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del hotel.
 *       responses:
 *         '200':
 *           description: Hotel eliminado exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Hotel eliminado junto con sus habitaciones y reservas canceladas
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
 *                     example: Error al eliminar el hotel
 *                   error:
 *                     type: string
 *                     example: Internal server error
 *   /hotel/estadisticasManager:
 *     get:
 *       tags:
 *         - Hotel
 *       summary: Obtener estadísticas generales de hoteles
 *       description: Permite a los administradores obtener estadísticas generales de los hoteles.
 *       responses:
 *         '200':
 *           description: Estadísticas obtenidas exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   totalHoteles:
 *                     type: integer
 *                     example: 10
 *                   hotelesActivos:
 *                     type: integer
 *                     example: 8
 *                   hotelesInactivos:
 *                     type: integer
 *                     example: 2
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Error al obtener estadísticas
 *   /hotel/estadisticasHotel/{id}:
 *     get:
 *       tags:
 *         - Hotel
 *       summary: Obtener estadísticas de un hotel específico
 *       description: Permite obtener estadísticas detalladas de un hotel específico.
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del hotel.
 *       responses:
 *         '200':
 *           description: Estadísticas obtenidas exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   totalReservas:
 *                     type: integer
 *                     example: 50
 *                   habitacionesDisponibles:
 *                     type: integer
 *                     example: 10
 *                   habitacionesOcupadas:
 *                     type: integer
 *                     example: 40
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
 *                     example: Error al obtener estadísticas
 */