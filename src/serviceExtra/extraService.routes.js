import { Router } from "express";
import { createExtraServiceValidator, deleteExtraServiceValidator, updateExtraServiceValidator } from "../middlewares/extraService-validators.js";
import { createExtraService, deleteExtraService, listServiceExtra, updateExtraService } from "./extraServices.controller.js";

const router = Router()

/**
 * @swagger
 * /extraService/addExtraService:
 *   post:
 *     tags:
 *       - ExtraService
 *     summary: Crear un nuevo servicio extra
 *     description: |
 *         Permite crear un nuevo servicio adicional en el sistema.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide todos los campos requeridos antes de enviar la solicitud.
 *         - No haga referencia a ningún modelo en la petición.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del servicio extra.
 *               descripcion:
 *                 type: string
 *                 description: Descripción del servicio extra.
 *               precio:
 *                 type: number
 *                 description: Precio del servicio extra.
 *           example:
 *             nombre: "Desayuno buffet"
 *             descripcion: "Acceso a desayuno buffet todos los días"
 *             precio: 15.99
 *     responses:
 *       200:
 *         description: Servicio extra creado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: "El servicio extra creado con exito"
 *               extraService:
 *                 nombre: "Desayuno buffet"
 *                 descripcion: "Acceso a desayuno buffet todos los días"
 *                 precio: 15.99
 *       400:
 *         description: Error al crear el servicio extra.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al crear tu servicio extra"
 *               error: "El servicio extra no ha sido encontrado"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al crear sercvicio extra"
 *               error: "Descripción del error"
 */
router.post('/addExtraService', createExtraServiceValidator, createExtraService);

/**
 * @swagger
 * /extraService/updateExtraService/{uid}:
 *   put:
 *     tags:
 *       - ExtraService
 *     summary: Actualizar un servicio extra
 *     description: |
 *         Permite actualizar los datos de un servicio adicional existente.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Envíe solo los campos que desea actualizar.
 *         - No haga referencia a ningún modelo en la petición.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del servicio extra.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre del servicio extra.
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción del servicio extra.
 *               precio:
 *                 type: number
 *                 description: Nuevo precio del servicio extra.
 *           example:
 *             nombre: "Desayuno continental"
 *             descripcion: "Desayuno continental mejorado"
 *             precio: 18.99
 *     responses:
 *       200:
 *         description: Servicio extra actualizado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: "El servicio actualizado con exito"
 *               extraService:
 *                 nombre: "Desayuno continental"
 *                 descripcion: "Desayuno continental mejorado"
 *                 precio: 18.99
 *       400:
 *         description: Error al actualizar el servicio extra.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al actualizar el servicio extra"
 *               error: "Servicio extra no encontrado"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al actualizar el sersvicio extra"
 *               error: "Descripción del error"
 */
router.put('/updateExtraService/:uid', updateExtraServiceValidator, updateExtraService);

/**
 * @swagger
 * /extraService/deleteExtraService/{uid}:
 *   delete:
 *     tags:
 *       - ExtraService
 *     summary: Eliminar (cancelar) un servicio extra
 *     description: |
 *         Permite cancelar (eliminar lógicamente) un servicio adicional existente.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Verifique que el identificador del servicio extra sea correcto.
 *         - No haga referencia a ningún modelo en la petición.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador único del servicio extra.
 *     responses:
 *       200:
 *         description: Servicio extra cancelado con éxito.
 *         content:
 *           application/json:
 *             example:
 *               message: "Servicio extra ah sido cancelado con exito "
 *               event:
 *                 nombre: "Desayuno buffet"
 *                 descripcion: "Acceso a desayuno buffet todos los días"
 *                 precio: 15.99
 *       400:
 *         description: Error al eliminar el servicio extra.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al eliminar el servicio extra"
 *               error: "Servicio extra no encontrado"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al eliminar el servicio extra"
 *               error: "Descripción del error"
 */
router.delete('/deleteExtraService/:uid', deleteExtraServiceValidator, deleteExtraService);

/**
 * @swagger
 * /extraService/serviceExtraList/:
 *   get:
 *     tags:
 *       - ExtraService
 *     summary: Listar todos los servicios adicionales
 *     description: |
 *         Obtiene la lista completa de todos los servicios adicionales disponibles en el sistema, sin filtrar por hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros o paginación si espera una gran cantidad de servicios adicionales.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     responses:
 *       '200':
 *         description: Lista de todos los servicios adicionales obtenida exitosamente.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get('/serviceExtraList/', listServiceExtra)

export default router

