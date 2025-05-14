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
 *       description: |
 *         Permite buscar hoteles según criterios como nombre, dirección, calificación o categoría.  
 *         **Roles permitidos:** Público (sin autenticación)
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Utilice filtros adecuados para evitar consultas innecesariamente grandes.
 *         - Implemente paginación si espera grandes volúmenes de resultados.
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
 *       x-ejemplo-request:
 *         summary: Ejemplo de búsqueda de hotel
 *         value:
 *           name: "Hotel Central"
 *           address: "Centro"
 *           qualification: "5"
 *           category: "Lujo"
 * 
 *   /hotel/searchHotelsAdmin:
 *     get:
 *       tags:
 *         - Hotel
 *       summary: Buscar hoteles para administradores
 *       description: |
 *         Permite a los administradores visualizar los hoteles en los cuales estos son encargados, buscando a partir del id del usuario del token.  
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide el token de autenticación antes de realizar la consulta.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Implemente paginación si espera grandes volúmenes de resultados.
 *       security:
 *         - bearerAuth: []
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
 * 
 *   /hotel/registerHotel:
 *     post:
 *       tags:
 *         - Hotel
 *       summary: Registrar un nuevo hotel
 *       description: |
 *         Permite registrar un nuevo hotel en el sistema.  
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide todos los campos requeridos antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - En caso de error de validación, revise los mensajes detallados en la respuesta.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *             example:
 *               {
 *                 "name": "Hotel Central",
 *                 "address": "Centro, Ciudad",
 *                 "qualification": "5",
 *                 "category": "Lujo",
 *                 "amenities": ["Piscina", "WiFi", "Gimnasio"],
 *                 "admin": "663b1c2f4b2e2a0012a3b456"
 *               }
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
 * 
 *   /hotel/updateHotel/{id}:
 *     put:
 *       tags:
 *         - Hotel
 *       summary: Actualizar un hotel
 *       description: |
 *         Permite actualizar los datos de un hotel existente.  
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Actualice solo los campos necesarios para optimizar el rendimiento.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *       security:
 *         - bearerAuth: []
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
 *             example:
 *               {
 *                 "name": "Hotel Central Actualizado",
 *                 "address": "Zona 2, Ciudad",
 *                 "qualification": "4",
 *                 "category": "Negocios",
 *                 "amenities": ["WiFi", "Restaurante"]
 *               }
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
 * 
 *   /hotel/deleteHotel/{id}:
 *     delete:
 *       tags:
 *         - Hotel
 *       summary: Eliminar un hotel
 *       description: |
 *         Permite eliminar un hotel y todas sus habitaciones y reservas asociadas.  
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Verifique que el identificador enviado sea correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Evite realizar múltiples eliminaciones innecesarias para optimizar el rendimiento.
 *       security:
 *         - bearerAuth: []
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
 * 
 *   /hotel/estadisticasManager:
 *     get:
 *       tags:
 *         - Hotel
 *       summary: Obtener estadísticas generales de hoteles del manager, estos los busca apartir de su id de usuario en el token.
 *       description: |
 *         Permite a los administradores obtener estadísticas generales de los hoteles.  
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros o paginación si espera una gran cantidad de hoteles.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *       security:
 *         - bearerAuth: []
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
 * 
 *   /hotel/estadisticasHotel/{id}:
 *     get:
 *       tags:
 *         - Hotel
 *       summary: Obtener estadísticas de un hotel específico
 *       description: |
 *         Permite obtener estadísticas detalladas de un hotel específico.  
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el identificador del hotel sea correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *       security:
 *         - bearerAuth: []
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