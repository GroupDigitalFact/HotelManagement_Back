import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";

const router = Router();

router.post("/register", uploadProfilePicture.single("profilePicture"), registerValidator, register);
router.post("/login", loginValidator, login);

export default router;

/**
 * @swagger
 * paths:
 *   /auth/register:
 *     post:
 *       summary: Registro de un nuevo usuario
 *       description: Permite registrar un nuevo usuario en el sistema.
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Nombre del usuario.
 *                   example: Juan
 *                 surname:
 *                   type: string
 *                   description: Apellido del usuario.
 *                   example: Pérez
 *                 username:
 *                   type: string
 *                   description: Nombre de usuario único.
 *                   example: juanperez
 *                 email:
 *                   type: string
 *                   description: Correo electrónico único.
 *                   example: juan.perez@example.com
 *                 password:
 *                   type: string
 *                   description: Contraseña del usuario.
 *                   example: password123
 *                 phone:
 *                   type: string
 *                   description: Número de teléfono del usuario.
 *                   example: 12345678
 *                 role:
 *                   type: string
 *                   description: |
 *                     Rol del usuario. Valores permitidos:
 *                     - USER_ROLE
 *                     - ADMIN_ROLE
 *                     - HOTEL_ADMIN_ROLE.
 *                   example: USER_ROLE
 *                 profilePicture:
 *                   type: string
 *                   format: binary
 *                   description: Imagen de perfil del usuario (opcional).
 *       responses:
 *         '201':
 *           description: Usuario creado exitosamente.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User has been created
 *                   name:
 *                     type: string
 *                     example: Juan
 *                   email:
 *                     type: string
 *                     example: juan.perez@example.com
 *         '400':
 *           description: Error de validación en los datos enviados.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User registration failed
 *                   error:
 *                     type: string
 *                     example: Email is required
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User registration failed
 *                   error:
 *                     type: string
 *                     example: Internal server error
 *   /auth/login:
 *     post:
 *       summary: Inicio de sesión
 *       description: Permite a un usuario iniciar sesión en el sistema.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: Correo electrónico del usuario (opcional si se usa `username`).
 *                   example: juan.perez@example.com
 *                 username:
 *                   type: string
 *                   description: Nombre de usuario (opcional si se usa `email`).
 *                   example: juanperez
 *                 password:
 *                   type: string
 *                   description: Contraseña del usuario.
 *                   example: password123
 *       responses:
 *         '200':
 *           description: Inicio de sesión exitoso.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Login successful
 *                   userDetails:
 *                     type: object
 *                     properties:
 *                       token:
 *                         type: string
 *                         description: Token JWT generado.
 *                         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                       profilePicture:
 *                         type: string
 *                         description: URL de la imagen de perfil del usuario.
 *                         example: profile.jpg
 *         '400':
 *           description: Credenciales inválidas.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Crendenciales inválidas
 *                   error:
 *                     type: string
 *                     example: No existe el usuario o correo ingresado
 *         '500':
 *           description: Error interno del servidor.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: login failed, server error
 *                   error:
 *                     type: string
 *                     example: Internal server error
 */