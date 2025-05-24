import { Router } from "express";
import { delteHotelValidator, estadisticasHotelValidator, registerHotelValidator, searchHotelManagerValidator, searchHotelValidator, updateHotelValidator } from "../middlewares/hotel-validators.js";
import { uploadHotelPicture } from "../middlewares/multer-uploads.js";
import { deleteHotel, getHotels, obtenerEstadisticasHotel, obtenerEstadisticasPorHotelId, registerHotel, searchHotel, searchHotelsAdmin, updateHotel } from "./hotel.controller.js";

const router = Router();

/**
 * @swagger
 * /hotel/searchHotel:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Buscar hoteles por criterios
 *     description: |
 *         Permite buscar hoteles por nombre, dirección, calificación o categoría.
 *         
 *         **Roles permitidos:** Público (no requiere autenticación)
 *         
 *         **Recomendaciones:**
 *         - Puede enviar uno o varios parámetros de búsqueda en el body.
 *         - Si no se envía ningún parámetro, se listarán todos los hoteles.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del hotel.
 *               address:
 *                 type: string
 *                 description: Dirección del hotel.
 *               qualification:
 *                 type: string
 *                 description: Calificación (1 estrella, 2 estrellas, etc).
 *               category:
 *                 type: string
 *                 description: Categoría (Económico, Estandar, Boutique, Lujoso).
 *           example:
 *             name: "Central"
 *             category: "Estandar"
 *     responses:
 *       200:
 *         description: Lista de hoteles encontrados.
 *         content:
 *           application/json:
 *             example:
 *               - name: "Hotel Central"
 *                 address: "Av. Principal 123"
 *                 qualification: "3 estrellas"
 *                 category: "Estandar"
 *                 amenities: ["WiFi", "Piscina"]
 *       404:
 *         description: No se encontraron hoteles con los criterios indicados.
 *         content:
 *           application/json:
 *             example:
 *               message: "No se encontraron hoteles con los criterios indicados"
 *       500:
 *         description: Error al buscar hoteles.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al buscar hoteles"
 */
router.get("/searchHotel",  searchHotelValidator, searchHotel);

/**
 * @swagger
 * /hotel/searchHotelsAdmin:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Buscar hoteles administrados por el usuario autenticado
 *     description: |
 *         Devuelve los hoteles administrados por el usuario autenticado.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones:**
 *         - Debe enviar el token de autenticación en el header Authorization.
 *     responses:
 *       200:
 *         description: Lista de hoteles administrados por el usuario.
 *         content:
 *           application/json:
 *             example:
 *               hoteles: [
 *                 {
 *                   name: "Hotel Central",
 *                   address: "Av. Principal 123",
 *                   qualification: "3 estrellas",
 *                   category: "Estandar"
 *                 }
 *               ]
 *       401:
 *         description: Token no proporcionado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Token no proporcionado"
 *       404:
 *         description: No se encontraron hoteles administrados por este usuario.
 *         content:
 *           application/json:
 *             example:
 *               message: "No se encontraron hoteles administrados por este usuario"
 *       500:
 *         description: Error al obtener los hoteles.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al obtener los hoteles"
 */
router.get("/searchHotelsAdmin", searchHotelManagerValidator, searchHotelsAdmin);

/**
 * @swagger
 * /hotel/registerHotel:
 *   post:
 *     tags:
 *       - Hotel
 *     summary: Registrar un nuevo hotel
 *     description: |
 *         Permite registrar un nuevo hotel en el sistema.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones:**
 *         - Envíe todos los campos requeridos y una imagen (campo hotelPicture) si desea agregar una foto.
 *         - El campo amenities debe ser un array de strings.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, address, qualification, category, amenities, quantitySalons, priceBaseEvent, admin]
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               qualification:
 *                 type: string
 *                 enum: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas']
 *               category:
 *                 type: string
 *                 enum: ['Económico', 'Estandar', 'Boutique', 'Lujoso']
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               quantitySalons:
 *                 type: number
 *               priceBaseEvent:
 *                 type: number
 *               admin:
 *                 type: string
 *               hotelPicture:
 *                 type: string
 *                 format: binary
 *           example:
 *             name: "Hotel Central"
 *             address: "Av. Principal 123"
 *             qualification: "3 estrellas"
 *             category: "Estandar"
 *             amenities: ["WiFi", "Piscina"]
 *             quantitySalons: 3
 *             priceBaseEvent: 500
 *             admin: "6650e1f2c8b4b2a1d4e8a789"
 *     responses:
 *       201:
 *         description: Hotel registrado correctamente.
 *         content:
 *           application/json:
 *             example:
 *               message: "Hotel registrado correctamente"
 *               hotel:
 *                 name: "Hotel Central"
 *                 address: "Av. Principal 123"
 *                 qualification: "3 estrellas"
 *                 category: "Estandar"
 *                 amenities: ["WiFi", "Piscina"]
 *                 quantitySalons: 3
 *                 priceBaseEvent: 500
 *                 admin: "6650e1f2c8b4b2a1d4e8a789"
 *                 hotelPicture: "hotel.jpg"
 *       500:
 *         description: Error al registrar el hotel.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al registrar el hotel"
 *               error: "Descripción del error"
 */
router.post("/registerHotel", uploadHotelPicture.single('hotelPicture'), registerHotelValidator, registerHotel);

/**
 * @swagger
 * /hotel/updateHotel/{id}:
 *   put:
 *     tags:
 *       - Hotel
 *     summary: Actualizar información de un hotel
 *     description: |
 *         Permite actualizar los datos de un hotel existente.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones:**
 *         - Envíe solo los campos que desea actualizar.
 *         - El id debe ser válido y corresponder a un hotel existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               qualification:
 *                 type: string
 *               category:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               quantitySalons:
 *                 type: number
 *               priceBaseEvent:
 *                 type: number
 *           example:
 *             name: "Hotel Central Actualizado"
 *             address: "Nueva dirección 456"
 *     responses:
 *       200:
 *         description: Hotel actualizado correctamente.
 *         content:
 *           application/json:
 *             example:
 *               message: "Hotel actualizado correctamente"
 *               hotel:
 *                 name: "Hotel Central Actualizado"
 *                 address: "Nueva dirección 456"
 *       404:
 *         description: Hotel no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Hotel no encontrado"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error interno del servidor"
 *               error: "Descripción del error"
 */
router.put("/updateHotel/:id", updateHotelValidator, updateHotel);

/**
 * @swagger
 * /hotel/deleteHotel/{id}:
 *   delete:
 *     tags:
 *       - Hotel
 *     summary: Eliminar un hotel
 *     description: |
 *         Permite eliminar un hotel, sus habitaciones y cancelar sus reservas.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones:**
 *         - El id debe ser válido y corresponder a un hotel existente.
 *         - Esta acción elimina habitaciones y cancela reservas asociadas.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel a eliminar.
 *     responses:
 *       200:
 *         description: Hotel eliminado junto con sus habitaciones y reservas canceladas.
 *         content:
 *           application/json:
 *             example:
 *               message: "Hotel eliminado junto con sus habitaciones y reservas canceladas"
 *       404:
 *         description: Hotel no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Hotel no encontrado"
 *       500:
 *         description: Error al eliminar el hotel.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al eliminar el hotel"
 *               error: "Descripción del error"
 */
router.delete("/deleteHotel/:id", delteHotelValidator, deleteHotel);

/**
 * @swagger
 * /hotel/estadisticasManager:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Obtener estadísticas de hoteles administrados
 *     description: |
 *         Devuelve estadísticas de todos los hoteles administrados por el usuario autenticado.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones:**
 *         - Debe enviar el token de autenticación en el header Authorization.
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente.
 *         content:
 *           application/json:
 *             example:
 *               estadisticas: [
 *                 {
 *                   hotelId: "6650e1f2c8b4b2a1d4e8a456",
 *                   hotelNombre: "Hotel Central",
 *                   totalHabitaciones: 10,
 *                   habitacionesOcupadas: 5,
 *                   totalReservas: 20,
 *                   ingresosMensuales: [1000, 1200, 900, ...],
 *                   serviciosMasUsados: [{ name: "WiFi", count: 15 }]
 *                 }
 *               ]
 *       401:
 *         description: Token no proporcionado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Token no proporcionado"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error interno del servidor"
 *               error: "Descripción del error"
 */
router.get('/estadisticasManager', estadisticasHotelValidator, obtenerEstadisticasHotel);

/**
 * @swagger
 * /hotel/estadisticasHotel/{id}:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Obtener estadísticas de un hotel por ID
 *     description: |
 *         Devuelve estadísticas detalladas de un hotel específico.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones:**
 *         - El id debe ser válido y corresponder a un hotel existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del hotel.
 *     responses:
 *       200:
 *         description: Estadísticas del hotel obtenidas correctamente.
 *         content:
 *           application/json:
 *             example:
 *               estadisticas:
 *                 hotelId: "6650e1f2c8b4b2a1d4e8a456"
 *                 hotelNombre: "Hotel Central"
 *                 encargadoNombre: "Juan Pérez"
 *                 encargadoEmail: "juan@email.com"
 *                 totalHabitaciones: 10
 *                 habitacionesOcupadas: 5
 *                 totalReservas: 20
 *                 ingresosMensuales: [1000, 1200, 900, ...]
 *                 serviciosMasUsados: [{ name: "WiFi", count: 15 }]
 *       404:
 *         description: Hotel no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Hotel no encontrado"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error interno del servidor"
 *               error: "Descripción del error"
 */
router.get('/estadisticasHotel/:id', estadisticasHotelValidator, obtenerEstadisticasPorHotelId);

/**
 * @swagger
 * /hotel/getHotels:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Listar todos los hoteles activos
 *     description: |
 *         Devuelve la lista de todos los hoteles activos.
 *         
 *         **Roles permitidos:** Público (no requiere autenticación)
 *         
 *         **Recomendaciones:**
 *         - Puede usar este endpoint para mostrar hoteles en listados públicos.
 *     responses:
 *       200:
 *         description: Lista de hoteles activos.
 *         content:
 *           application/json:
 *             example:
 *               hotels: [
 *                 {
 *                   name: "Hotel Central",
 *                   address: "Av. Principal 123",
 *                   qualification: "3 estrellas",
 *                   category: "Estandar",
 *                   amenities: ["WiFi", "Piscina"],
 *                   status: true
 *                 }
 *               ]
 *       500:
 *         description: Error al obtener los hoteles.
 *         content:
 *           application/json:
 *             example:
 *               error: "Error to find it"
 */
router.get("/getHotels", searchHotelValidator, getHotels);

export default router;
