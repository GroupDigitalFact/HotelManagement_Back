import { Router } from "express";
import { searchHotel, deleteHotel, searchHotelsAdmin, updateHotel, registerHotel, obtenerEstadisticasHotel, obtenerEstadisticasPorHotelId, getHotels } from "./hotel.controller.js";
import { searchHotelValidator, registerHotelValidator, updateHotelValidator, searchHotelManagerValidator, delteHotelValidator, estadisticasHotelValidator, estadisticasHotelAdminValidator } from "../middlewares/hotel-validators.js";
import { uploadHotelPicture } from "../middlewares/multer-uploads.js";

const router = Router();

/**
 * @swagger
 * /hotel/searchHotel:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Buscar hoteles
 *     description: |
 *         Permite buscar hoteles según criterios como nombre, dirección, calificación o categoría.  
 *         **Roles permitidos:** Público (sin autenticación)
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Utilice filtros adecuados para evitar consultas innecesariamente grandes.
 *         - Implemente paginación si espera grandes volúmenes de resultados.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Nombre del hotel.
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Dirección del hotel.
 *       - in: query
 *         name: qualification
 *         schema:
 *           type: string
 *         description: Calificación del hotel.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Categoría del hotel.
 *     responses:
 *       200:
 *         description: Lista de hoteles encontrados.
 *       404:
 *         description: No se encontraron hoteles con los criterios indicados.
 *       500:
 *         description: Error interno del servidor.
 */

router.get("/searchHotel",  searchHotelValidator, searchHotel);
/**
 * @swagger
 * /hotel/searchHotelsAdmin:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Buscar hoteles para administradores
 *     description: |
 *         Permite a los administradores visualizar los hoteles en los cuales estos son encargados, buscando a partir del id del usuario del token.  
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide el token de autenticación antes de realizar la consulta.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Implemente paginación si espera grandes volúmenes de resultados.
 *     responses:
 *       200:
 *         description: Lista de hoteles obtenida exitosamente.
 *       500:
 *         description: Error interno del servidor.
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
 *           example:
 *             name: "Hotel Central"
 *             address: "Centro, Ciudad"
 *             qualification: "5"
 *             category: "Lujo"
 *             amenities: ["Piscina", "WiFi", "Gimnasio"]
 *             admin: "663b1c2f4b2e2a0012a3b456"
 *     responses:
 *       201:
 *         description: Hotel registrado exitosamente.
 *       400:
 *         description: Faltan datos obligatorios.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/registerHotel", uploadHotelPicture.single('hotelPicture'), registerHotelValidator, registerHotel);

/**
 * @swagger
 * /hotel/updateHotel/{id}:
 *   put:
 *     tags:
 *       - Hotel
 *     summary: Actualizar un hotel
 *     description: |
 *         Permite actualizar los datos de un hotel existente.  
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Actualice solo los campos necesarios para optimizar el rendimiento.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Hotel Central Actualizado"
 *             address: "Zona 2, Ciudad"
 *             qualification: "4"
 *             category: "Negocios"
 *             amenities: ["WiFi", "Restaurante"]
 *     responses:
 *       200:
 *         description: Hotel actualizado exitosamente.
 *       404:
 *         description: Hotel no encontrado.
 *       500:
 *         description: Error interno del servidor.
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
 *         Permite eliminar un hotel y todas sus habitaciones y reservas asociadas.  
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Verifique que el identificador enviado sea correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Evite realizar múltiples eliminaciones innecesarias para optimizar el rendimiento.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *     responses:
 *       200:
 *         description: Hotel eliminado exitosamente.
 *       404:
 *         description: Hotel no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */

router.delete("/deleteHotel/:id", delteHotelValidator, deleteHotel);

/**
 * @swagger
 * /hotel/estadisticasManager:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Obtener estadísticas generales de hoteles del manager
 *     description: |
 *         Permite a los administradores obtener estadísticas generales de los hoteles.  
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros o paginación si espera una gran cantidad de hoteles.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/estadisticasManager', estadisticasHotelValidator, obtenerEstadisticasHotel);


/**
 * @swagger
 * /hotel/estadisticasHotel/{id}:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Obtener estadísticas de un hotel específico
 *     description: |
 *         Permite obtener estadísticas detalladas de un hotel específico.  
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el identificador del hotel sea correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del hotel.
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente.
 *       404:
 *         description: Hotel no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/estadisticasHotel/:id', estadisticasHotelAdminValidator, obtenerEstadisticasPorHotelId);

/**
 * @swagger
 * /hotel/getHotels:
 *   get:
 *     tags:
 *       - Hotel
 *     summary: Obtener lista de todos los hoteles
 *     description: |
 *         Permite obtener la lista completa de hoteles registrados en el sistema.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros o paginación si espera una gran cantidad de hoteles.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *     responses:
 *       200:
 *         description: Lista de hoteles obtenida exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/getHotels", searchHotelValidator, getHotels);

export default router;
