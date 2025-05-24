import { Router } from "express";
import { deleteUser, deleteUserAdmin, editProfile, editUserAdmin, getUserAdminHotel, updateProfilePicture, updatePassword, getUsers, getUserClient, getUserHotel, deleteProfilePicture ,getUsersAll} from "./user.controller.js";
import { deleteUserValidator, deleteUserAdminValidator, updateUserValidator, updateUserAdminValidator, getUserEditValidator, updatePasswordValidator, getUserAdminValidator, getUserValidator} from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";


const router = Router();


/**
 * @swagger
 * /user/delete/me:
 *   delete:
 *     tags:
 *       - User
 *     summary: Eliminar mi cuenta
 *     description: |
 *         Permite al usuario autenticado eliminar su cuenta y liberar sus reservaciones. Esto se hace a partir de la obtención del id del usuario a través de su token.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Asegúrese de enviar el token de autenticación correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Confirme la acción antes de eliminar la cuenta, ya que es irreversible.
 *     responses:
 *       '200':
 *         description: Usuario eliminado exitosamente.
 *       '401':
 *         description: Token no proporcionado.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.delete("/delete/me", deleteUserValidator, deleteUser);


/**
 * @swagger
 * /user/delete/admin:
 *   delete:
 *     tags:
 *       - User
 *     summary: Eliminar un usuario (Administrador)
 *     description: |
 *         Permite a un administrador eliminar un usuario específico.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que el identificador del usuario sea correcto antes de enviar la solicitud.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Confirme la acción antes de eliminar la cuenta, ya que es irreversible.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: Identificador único del usuario.
 *     responses:
 *       '200':
 *         description: Usuario eliminado exitosamente.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.delete("/delete/admin", deleteUserAdminValidator, deleteUserAdmin);


/**
 * @swagger
 * /user/editProfile:
 *   put:
 *     tags:
 *       - User
 *     summary: Editar mi perfil
 *     description: |
 *         Permite al usuario autenticado actualizar su información personal.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los campos antes de enviarlos.
 *         - Envíe solo los campos que desea actualizar para optimizar el rendimiento.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del usuario.
 *               surname:
 *                 type: string
 *                 description: Nuevo apellido del usuario.
 *               phone:
 *                 type: string
 *                 description: Nuevo número de teléfono.
 *     responses:
 *       '200':
 *         description: Perfil actualizado exitosamente.
 *       '400':
 *         description: No se proporcionaron campos para actualizar.
 *       '500':
 *         description: Error interno del servidor.
 */
router.put("/editProfile", updateUserValidator,editProfile)


/**
 * @swagger
 * /user/editUsers:
 *   put:
 *     tags:
 *       - User
 *     summary: Editar un usuario (Administrador)
 *     description: |
 *         Permite a un administrador editar la información de un usuario específico.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide los campos antes de enviarlos.
 *         - Envíe solo los campos que desea actualizar para optimizar el rendimiento.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: Identificador único del usuario.
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del usuario.
 *               surname:
 *                 type: string
 *                 description: Nuevo apellido del usuario.
 *               phone:
 *                 type: string
 *                 description: Nuevo número de teléfono.
 *     responses:
 *       '200':
 *         description: Usuario actualizado exitosamente.
 *       '404':
 *         description: Usuario no encontrado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.put("/editUsers/:uid", updateUserAdminValidator, editUserAdmin)
/**
 * @swagger
 * /user/updateProfilePicture:
 *   patch:
 *     tags:
 *       - User
 *     summary: Actualizar foto de perfil
 *     description: |
 *         Permite al usuario autenticado actualizar su foto de perfil.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Envíe una imagen válida en formato soportado.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - El tamaño de la imagen debe ser razonable para optimizar el rendimiento.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen para la foto de perfil.
 *     responses:
 *       '200':
 *         description: Foto de perfil actualizada exitosamente.
 *       '400':
 *         description: No se proporcionó una imagen válida.
 *       '500':
 *         description: Error interno del servidor.
 */
router.patch("/updateProfilePicture", uploadProfilePicture.single("profilePicture"), getUserEditValidator, updateProfilePicture)


/**
 * @swagger
 * /user/updatePassword:
 *   put:
 *     tags:
 *       - User
 *     summary: Actualizar contraseña
 *     description: |
 *         Permite al usuario autenticado actualizar su contraseña.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Valide que la contraseña actual y la nueva sean correctas y seguras.
 *         - No reutilice contraseñas anteriores.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Contraseña actual del usuario.
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña del usuario.
 *     responses:
 *       '200':
 *         description: Contraseña actualizada exitosamente.
 *       '400':
 *         description: Contraseña actual incorrecta.
 *       '500':
 *         description: Error interno del servidor.
 */
router.put("/updatePassword", updatePasswordValidator, updatePassword)


/**
 * @swagger
 * /user/getUsers:
 *   post:
 *     tags:
 *       - User
 *     summary: Obtener usuarios (Administrador)
 *     description: |
 *         Permite a un administrador obtener una lista de usuarios registrados o buscar un usuario en específico.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Utilice filtros y paginación para optimizar el rendimiento en consultas grandes.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *         - Solicite solo los datos necesarios.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filter:
 *                 type: string
 *                 description: Filtro opcional para buscar usuarios por nombre o correo.
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida exitosamente.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get("/getUsers", getUserAdminValidator, getUsers);


/**
 * @swagger
 * /user/:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener información del usuario autenticado
 *     description: |
 *         Permite al usuario autenticado obtener su información personal.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Asegúrese de enviar el token de autenticación correcto.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     responses:
 *       '200':
 *         description: Información del usuario obtenida exitosamente.
 *       '401':
 *         description: Token no proporcionado.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get("/user/", getUserValidator, getUserClient );

/**
 * @swagger
 * /user/getUserAdminHotel:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener usuarios administradores de hotel
 *     description: |
 *         Permite obtener una lista de usuarios con el rol de administrador de hotel.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida exitosamente.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get("/getUserAdminHotel", getUserAdminHotel);

/**
 * @swagger
 * /user/getUserHotel/:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener usuarios con rol de hotel
 *     description: |
 *         Permite obtener una lista de usuarios que tienen el rol asociado a hotel (por ejemplo, HOTEL_ROLE o similar).
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *         - Maneje los errores utilizando los códigos de estado y mensajes proporcionados por la API.
 *     responses:
 *       '200':
 *         description: Lista de usuarios de hotel obtenida exitosamente.
 *       '500':
 *         description: Error interno del servidor.
 */
router.get("/getUserHotel/", getUserHotel);

router.delete("/deleteProfilePicture", getUserEditValidator, deleteProfilePicture,)

router.get("/getUsersAll", getUserAdminValidator, getUsersAll);

export default router;

