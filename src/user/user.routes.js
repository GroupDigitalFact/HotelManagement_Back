import { Router } from "express";

import { uploadProfilePicture } from "../middlewares/multer-uploads.js";
import { deleteUserAdminValidator, deleteUserValidator, getUserAdminValidator, getUserEditValidator, getUserValidator, updatePasswordValidator, updateUserAdminValidator, updateUserValidator } from "../middlewares/user-validators.js";
import { deleteProfilePicture, deleteUser, deleteUserAdmin, editProfile, editUserAdmin, getUserAdminHotel, getUserClient, getUserHotel, getUsers, updatePassword, updateProfilePicture } from "./user.controller.js";


const router = Router();

/**
 * @swagger
 * /user/delete/me:
 *   delete:
 *     tags:
 *       - User
 *     summary: Eliminar mi cuenta
 *     description: |
 *         Permite al usuario autenticado eliminar su cuenta y liberar sus reservaciones.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones:**
 *         - Envíe el token de autenticación correcto.
 *         - Confirme la acción antes de eliminar la cuenta, ya que es irreversible.
 *     responses:
 *       '200':
 *         description: Usuario eliminado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Usuario, sus reservaciones y habitaciones liberadas correctamente"
 *       '401':
 *         description: Token no proporcionado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No se proporcionó token"
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al eliminar usuario y sus datos relacionados"
 *               error: "Descripción del error"
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
 *         Permite a un administrador eliminar un usuario específico por uid o username.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones:**
 *         - Valide que el identificador del usuario sea correcto antes de enviar la solicitud.
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
 *               username:
 *                 type: string
 *                 description: Username del usuario.
 *     responses:
 *       '200':
 *         description: Usuario eliminado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Usuario desactivado y sus reservaciones eliminadas correctamente"
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       '403':
 *         description: No se puede desactivar a un usuario administrador.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No se puede desactivar a un usuario administrador"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al desactivar el usuario y eliminar sus reservaciones"
 *               error: "Descripción del error"
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
 *         **Recomendaciones:**
 *         - Envíe solo los campos que desea actualizar.
 *         - No puede actualizar su contraseña ni su rol por este endpoint.
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
 *           example:
 *             name: "Juan"
 *             surname: "Pérez"
 *             phone: "5551234567"
 *     responses:
 *       '200':
 *         description: Perfil actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Usuario actualizado exitosamente"
 *               user: { name: "Juan", surname: "Pérez", phone: "5551234567" }
 *       '400':
 *         description: No se proporcionaron campos para actualizar.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No se proporcionaron campos para actualizar"
 *       '401':
 *         description: Token no proporcionado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Token no proporcionado"
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al actualizar el usuario"
 *               error: "Descripción del error"
 */
router.put("/editProfile", updateUserValidator, editProfile)

/**
 * @swagger
 * /user/editUsers:
 *   put:
 *     tags:
 *       - User
 *     summary: Editar un usuario (Administrador)
 *     description: |
 *         Permite a un administrador editar la información de un usuario específico por uid o username.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones:**
 *         - No puede modificar usuarios con rol ADMIN_ROLE.
 *         - Si cambia el username, asegúrese de que no esté en uso.
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
 *               username:
 *                 type: string
 *                 description: Username actual del usuario.
 *               newUsername:
 *                 type: string
 *                 description: Nuevo username.
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             uid: "6650e1f2c8b4b2a1d4e8a789"
 *             name: "Ana"
 *             surname: "García"
 *             phone: "5559876543"
 *     responses:
 *       '200':
 *         description: Usuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Usuario actualizado correctamente"
 *               user: { name: "Ana", surname: "García", phone: "5559876543" }
 *       '400':
 *         description: Debe proporcionar un ID o un nombre de usuario.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Debe proporcionar un ID o un nombre de usuario para buscar al usuario."
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       '403':
 *         description: No se puede modificar a un usuario con rol ADMIN_ROLE.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No se puede modificar a un usuario con rol ADMIN_ROLE"
 *       '409':
 *         description: El nuevo nombre de usuario ya está en uso.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "El nuevo nombre de usuario ya está en uso"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al actualizar el usuario"
 *               error: "Descripción del error"
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
 *         **Recomendaciones:**
 *         - Envíe una imagen válida en formato soportado.
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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Imagen actualizada correctamente"
 *               user: { profilePicture: "profile.jpg" }
 *       '400':
 *         description: No se envió una nueva imagen.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No se envió una nueva imagen"
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al actualizar la imagen"
 *               error: "Descripción del error"
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
 *         **Recomendaciones:**
 *         - Valide que la contraseña actual y la nueva sean correctas y seguras.
 *         - No reutilice contraseñas anteriores.
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
 *           example:
 *             currentPassword: "123456"
 *             newPassword: "NuevaPassword123"
 *     responses:
 *       '200':
 *         description: Contraseña actualizada exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Contraseña actualizada exitosamente"
 *       '400':
 *         description: Contraseña actual incorrecta o igual a la anterior.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "La contraseña actual es incorrecta"
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       '401':
 *         description: Token no proporcionado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Token no proporcionado"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al actualizar la contraseña"
 *               error: "Descripción del error"
 */
router.put("/updatePassword", updatePasswordValidator, updatePassword)

/**
 * @swagger
 * /user/getUsers:
 *   get:
 *     tags:
 *       - User
 *     summary: Obtener usuarios (Administrador)
 *     description: |
 *         Permite a un administrador obtener una lista de usuarios registrados o buscar un usuario en específico.
 *         
 *         **Roles permitidos:** ADMIN_ROLE
 *         
 *         **Recomendaciones:**
 *         - Utilice filtros y paginación para optimizar el rendimiento en consultas grandes.
 *         - Solicite solo los datos necesarios.
 *     parameters:
 *       - in: query
 *         name: username
 *         required: false
 *         schema:
 *           type: string
 *         description: Username para filtrar usuarios.
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               total: 2
 *               users: [
 *                 { name: "Juan", username: "juan123", email: "juan@email.com" }
 *               ]
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al obtener los usuarios"
 *               error: "Descripción del error"
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
 *     responses:
 *       '200':
 *         description: Información del usuario obtenida exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               user: { name: "Juan", surname: "Pérez", username: "juan123", email: "juan@email.com" }
 *       '401':
 *         description: Token no proporcionado.
 *         content:
 *           application/json:
 *             example:
 *               message: "Token no proporcionado"
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al obtener al usuario"
 *               error: "Descripción del error"
 */
router.get("/user/", getUserValidator, getUserClient);

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
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               user: [
 *                 { name: "Pedro", surname: "López", username: "pedroadmin", email: "pedro@email.com" }
 *               ]
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al obtener al usuario"
 *               error: "Descripción del error"
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
 *         Permite obtener una lista de usuarios que tienen el rol USER_ROLE.
 *         
 *         **Roles permitidos:** ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones para optimizar el uso de la API:**
 *         - Solicite solo los datos necesarios para optimizar el rendimiento.
 *     responses:
 *       '200':
 *         description: Lista de usuarios de hotel obtenida exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               user: [
 *                 { name: "Ana", surname: "García", username: "anahotel", email: "ana@email.com" }
 *               ]
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "User not found"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               message: "Error al obtener al usuario"
 *               error: "Descripción del error"
 */
router.get("/getUserHotel/", getUserHotel);

/**
 * @swagger
 * /user/deleteProfilePicture:
 *   delete:
 *     tags:
 *       - User
 *     summary: Eliminar foto de perfil
 *     description: |
 *         Permite al usuario autenticado eliminar su foto de perfil.
 *         
 *         **Roles permitidos:** USER_ROLE, ADMIN_ROLE, HOTEL_ADMIN_ROLE
 *         
 *         **Recomendaciones:**
 *         - Envíe el token de autenticación correcto.
 *         - Confirme la acción antes de eliminar la foto, ya que es irreversible.
 *     responses:
 *       '200':
 *         description: Foto de perfil eliminada exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Imagen eliminada correctamente"
 *               user: { profilePicture: null }
 *       '201':
 *         description: No contiene imagen.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "No contiene imagen"
 *       '404':
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Usuario no encontrado"
 *       '500':
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Error al eliminar la imagen"
 *               error: "Descripción del error"
 */
router.delete("/deleteProfilePicture", getUserEditValidator, deleteProfilePicture)


export default router;

