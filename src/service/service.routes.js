import { Router } from "express";
import { createService, getServices, getServiceById, getServiceByName, editService, deleteService } from "./service.controller.js";
import { createServiceValidator, editServiceValidator, deleteteServiceValidator } from "../middlewares/service-validators.js";

const router = Router();

router.post('/createService', createServiceValidator, createService);

router.get('/', getServices);

router.get('/getserviceId/:id', getServiceById);

router.get('/getserviceName/:name', getServiceByName);

router.put('/editservice/:id', editServiceValidator, editService);

router.delete('/deleteservice/:id', deleteteServiceValidator, deleteService);

export default router

/**
 * @swagger
 * tags:
 *   - name: Service
 *     description: Endpoints relacionados con la gestión de servicios.
 * 
 * paths:
 *   /service/createService:
 *     post:
 *       tags:
 *         - Service
 *       summary: Crear un nuevo servicio
 *       description: |
 *         Permite crear un nuevo servicio en el sistema.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide todos los campos requeridos antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - En caso de error de validación, revise los mensajes detallados en la respuesta.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nombre del servicio.
 *                 description:
 *                   type: string
 *                   description: Descripción del servicio.
 *             example:
 *               {
 *                 "name": "Servicio de lavandería",
 *                 "description": "Lavado y planchado de ropa con entrega en 24 horas."
 *               }
 *       responses:
 *         '201':
 *           description: Servicio creado exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   msg:
 *                     type: string
 *                     example: Service created successfully
 *                   service:
 *                     $ref: '#/components/schemas/Service'
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   msg:
 *                     type: string
 *                     example: Error creating service
 *   /service/:
 *     get:
 *       tags:
 *         - Service
 *       summary: Obtener todos los servicios
 *       description: |
 *         Obtiene una lista de todos los servicios activos en el sistema.
 *         
 *         **Roles permitidos:** Público (sin autenticación)
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros adecuados para evitar consultas innecesariamente grandes.
 *         - Implemente paginación si espera grandes volúmenes de resultados.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *       responses:
 *         '200':
 *           description: Lista de servicios obtenida exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Service'
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Error to find it
 *   /service/getserviceId/{id}:
 *     get:
 *       tags:
 *         - Service
 *       summary: Obtener un servicio por ID
 *       description: |
 *         Permite obtener un servicio específico utilizando su identificador único.
 *         
 *         **Roles permitidos:** Público (sin autenticación)
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el identificador enviado sea correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del servicio.
 *       responses:
 *         '200':
 *           description: Servicio obtenido exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Service'
 *         '404':
 *           description: Servicio no encontrado.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Cannot find to service
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Error to find service
 *   /service/getserviceName/{name}:
 *     get:
 *       tags:
 *         - Service
 *       summary: Obtener un servicio por nombre
 *       description: |
 *         Permite obtener un servicio específico utilizando su nombre.
 *         
 *         **Roles permitidos:** Público (sin autenticación)
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el nombre enviado sea correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *       parameters:
 *         - in: path
 *           name: name
 *           required: true
 *           schema:
 *             type: string
 *           description: Nombre del servicio.
 *       responses:
 *         '200':
 *           description: Servicio obtenido exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: true
 *                   message:
 *                     type: string
 *                     example: Service fetched successfully
 *                   service:
 *                     $ref: '#/components/schemas/Service'
 *         '404':
 *           description: Servicio no encontrado.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: Service not found
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     example: false
 *                   message:
 *                     type: string
 *                     example: Error fetching service
 *   /service/editservice/{id}:
 *     put:
 *       tags:
 *         - Service
 *       summary: Editar un servicio
 *       description: |
 *         Permite editar los datos de un servicio específico.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los datos de entrada antes de enviarlos.
 *         - Actualice solo los campos necesarios para optimizar el rendimiento.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del servicio.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nombre del servicio.
 *                 description:
 *                   type: string
 *                   description: Descripción del servicio.
 *             example:
 *               {
 *                 "name": "Servicio de lavandería actualizado",
 *                 "description": "Lavado y planchado de ropa con entrega en 12 horas."
 *               }
 *       responses:
 *         '200':
 *           description: Servicio actualizado exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Service'
 *         '404':
 *           description: Servicio no encontrado.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Cannot find service
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Error to update service
 *   /service/deleteservice/{id}:
 *     delete:
 *       tags:
 *         - Service
 *       summary: Eliminar un servicio
 *       description: |
 *         Permite desactivar un servicio específico.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Verifique que el identificador enviado sea correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Evite realizar múltiples eliminaciones innecesarias para optimizar el rendimiento.
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Identificador único del servicio.
 *       responses:
 *         '200':
 *           description: Servicio desactivado exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Service desactived
 *         '404':
 *           description: Servicio no encontrado.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Service not found
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Error to desactive service
 */