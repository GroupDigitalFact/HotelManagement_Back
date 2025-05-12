import { Router } from "express";
import { deleteUser, deleteUserAdmin, editProfile, editUserAdmin, updateProfilePicture, updatePassword, getUsers } from "./user.controller.js";
import { deleteUserValidator, deleteUserAdminValidator, updateUserValidator, updateUserAdminValidator, updateProfilePictureValidator, updatePasswordValidator, getUserAdminValidator } from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";


const router = Router();

router.delete("/delete/me", deleteUserValidator, deleteUser);

router.delete("/delete/admin", deleteUserAdminValidator, deleteUserAdmin);

router.put("/editProfile", updateUserValidator,editProfile)

router.put("/editUsers", updateUserAdminValidator, editUserAdmin)

router.patch("/updateProfilePicture", uploadProfilePicture.single("profilePicture"), updateProfilePictureValidator, updateProfilePicture)

router.put("/updatePassword", updatePasswordValidator, updatePassword)

router.post("/getUsers", getUserAdminValidator, getUsers);


export default router;

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Endpoints relacionados con la gestión de usuarios.
 * 
 * paths:
 *   /user/delete/me:
 *     delete:
 *       tags:
 *         - User
 *       summary: Eliminar mi cuenta
 *       description: Permite al usuario autenticado eliminar su cuenta y liberar sus reservaciones.
 *       responses:
 *         '200':
 *           description: Usuario eliminado exitosamente.
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
 *                     example: Usuario eliminado correctamente
 *         '401':
 *           description: Token no proporcionado.
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
 *                     example: No se proporcionó token
 *         '404':
 *           description: Usuario no encontrado.
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
 *                     example: Usuario no encontrado
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
 *                     example: Error al eliminar usuario
 *   /user/delete/admin:
 *     delete:
 *       tags:
 *         - User
 *       summary: Eliminar un usuario (Administrador)
 *       description: Permite a un administrador eliminar un usuario específico.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: string
 *                   description: Identificador único del usuario.
 *                   example: 609bda8f1c4ae34d5c8f9b2a
 *       responses:
 *         '200':
 *           description: Usuario eliminado exitosamente.
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
 *                     example: Usuario eliminado correctamente
 *         '404':
 *           description: Usuario no encontrado.
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
 *                     example: Usuario no encontrado
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
 *                     example: Error al eliminar usuario
 *   /user/editProfile:
 *     put:
 *       tags:
 *         - User
 *       summary: Editar mi perfil
 *       description: Permite al usuario autenticado actualizar su información personal.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nuevo nombre del usuario.
 *                   example: Juan
 *                 surname:
 *                   type: string
 *                   description: Nuevo apellido del usuario.
 *                   example: Pérez
 *                 phone:
 *                   type: string
 *                   description: Nuevo número de teléfono.
 *                   example: 12345678
 *       responses:
 *         '200':
 *           description: Perfil actualizado exitosamente.
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
 *                     example: Perfil actualizado correctamente
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         '400':
 *           description: No se proporcionaron campos para actualizar.
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
 *                     example: No se proporcionaron campos para actualizar
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
 *                     example: Error al actualizar el perfil
 *   /user/editUsers:
 *     put:
 *       tags:
 *         - User
 *       summary: Editar un usuario (Administrador)
 *       description: Permite a un administrador editar la información de un usuario específico.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: string
 *                   description: Identificador único del usuario.
 *                   example: 609bda8f1c4ae34d5c8f9b2a
 *                 name:
 *                   type: string
 *                   description: Nuevo nombre del usuario.
 *                   example: Juan
 *                 surname:
 *                   type: string
 *                   description: Nuevo apellido del usuario.
 *                   example: Pérez
 *                 phone:
 *                   type: string
 *                   description: Nuevo número de teléfono.
 *                   example: 12345678
 *       responses:
 *         '200':
 *           description: Usuario actualizado exitosamente.
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
 *                     example: Usuario actualizado correctamente
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         '404':
 *           description: Usuario no encontrado.
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
 *                     example: Usuario no encontrado
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
 *                     example: Error al actualizar el usuario
 *   /user/updateProfilePicture:
 *     patch:
 *       tags:
 *         - User
 *       summary: Actualizar foto de perfil
 *       description: Permite al usuario autenticado actualizar su foto de perfil.
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 profilePicture:
 *                   type: string
 *                   format: binary
 *                   description: Archivo de imagen para la foto de perfil.
 *       responses:
 *         '200':
 *           description: Foto de perfil actualizada exitosamente.
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
 *                     example: Foto de perfil actualizada correctamente
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         '400':
 *           description: No se proporcionó una imagen válida.
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
 *                     example: No se proporcionó una imagen válida
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
 *                     example: Error al actualizar la foto de perfil
 *   /user/updatePassword:
 *     put:
 *       tags:
 *         - User
 *       summary: Actualizar contraseña
 *       description: Permite al usuario autenticado actualizar su contraseña.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPassword:
 *                   type: string
 *                   description: Contraseña actual del usuario.
 *                   example: oldpassword123
 *                 newPassword:
 *                   type: string
 *                   description: Nueva contraseña del usuario.
 *                   example: newpassword456
 *       responses:
 *         '200':
 *           description: Contraseña actualizada exitosamente.
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
 *                     example: Contraseña actualizada correctamente
 *         '400':
 *           description: Contraseña actual incorrecta.
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
 *                     example: La contraseña actual no es correcta
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
 *                     example: Error al actualizar la contraseña
 *   /user/getUsers:
 *     post:
 *       tags:
 *         - User
 *       summary: Obtener usuarios (Administrador)
 *       description: Permite a un administrador obtener una lista de usuarios registrados.
 *       requestBody:
 *         required: false
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filter:
 *                   type: string
 *                   description: Filtro opcional para buscar usuarios por nombre o correo.
 *                   example: Juan
 *       responses:
 *         '200':
 *           description: Lista de usuarios obtenida exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/User'
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
 *                     example: Error al obtener la lista de usuarios
 */
