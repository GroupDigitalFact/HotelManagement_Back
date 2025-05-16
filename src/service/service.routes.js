import { Router } from "express";
import { createService, getServices, getServiceById, getServiceByName, editService, deleteService } from "./service.controller.js";
import { createServiceValidator, editServiceValidator, deleteteServiceValidator } from "../middlewares/service-validators.js";

const router = Router();


/**
 * @swagger
 * /service/createService:
 *   post:
 *     tags:
 *       - Service
 *     summary: Crear un nuevo servicio
 *     description: |
 *         Permite crear un nuevo servicio en el sistema.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide todos los campos requeridos antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - En caso de error de validación, revise los mensajes detallados en la respuesta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del servicio.
 *               description:
 *                 type: string
 *                 description: Descripción del servicio.
 *           example:
 *             name: "Servicio de lavandería"
 *             description: "Lavado y planchado de ropa con entrega en 24 horas."
 *     responses:
 *       '201':
 *         description: Servicio creado exitosamente.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/createService', createServiceValidator, createService);


/**
 * @swagger
 * /service/:
 *   get:
 *     tags:
 *       - Service
 *     summary: Obtener todos los servicios
 *     description: |
 *         Obtiene una lista de todos los servicios activos en el sistema.
 *         
 *         **Roles permitidos:** Público (sin autenticación)
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros adecuados para evitar consultas innecesariamente grandes.
 *         - Implemente paginación si espera grandes volúmenes de resultados.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     responses:
 *       '200':
 *         description: Lista de servicios obtenida exitosamente.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/', getServices);


/**
 * @swagger
 * /service/getserviceId/{id}:
 *   get:
 *     tags:
 *       - Service
 *     summary: Obtener un servicio por ID
 *     description: |
 *         Permite obtener un servicio específico utilizando su identificador único.
 *         
 *         **Roles permitidos:** Público (sin autenticación)
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el identificador enviado sea correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del servicio.
 *     responses:
 *       '200':
 *         description: Servicio obtenido exitosamente.
 *       '404':
 *         description: Servicio no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/getserviceId/:id', getServiceById);


/**
 * @swagger
 * /service/getserviceName/{name}:
 *   get:
 *     tags:
 *       - Service
 *     summary: Obtener un servicio por nombre
 *     description: |
 *         Permite obtener un servicio específico utilizando su nombre.
 *         
 *         **Roles permitidos:** Público (sin autenticación)
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el nombre enviado sea correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del servicio.
 *     responses:
 *       '200':
 *         description: Servicio obtenido exitosamente.
 *       '404':
 *         description: Servicio no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/getserviceName/:name', getServiceByName);


/**
 * @swagger
 * /service/editservice/{id}:
 *   put:
 *     tags:
 *       - Service
 *     summary: Editar un servicio
 *     description: |
 *         Permite editar los datos de un servicio específico.
 *         
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
 *         description: Identificador único del servicio.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del servicio.
 *               description:
 *                 type: string
 *                 description: Descripción del servicio.
 *           example:
 *             name: "Servicio de lavandería actualizado"
 *             description: "Lavado y planchado de ropa con entrega en 12 horas."
 *     responses:
 *       '200':
 *         description: Servicio actualizado exitosamente.
 *       '404':
 *         description: Servicio no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.put('/editservice/:id', editServiceValidator, editService);


/**
 * @swagger
 * /service/deleteservice/{id}:
 *   delete:
 *     tags:
 *       - Service
 *     summary: Eliminar un servicio
 *     description: |
 *         Permite desactivar un servicio específico.
 *         
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
 *         description: Identificador único del servicio.
 *     responses:
 *       '200':
 *         description: Servicio desactivado exitosamente.
 *       '404':
 *         description: Servicio no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.delete('/deleteservice/:id', deleteteServiceValidator, deleteService);

export default router

