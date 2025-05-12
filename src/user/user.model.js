import { Schema, model} from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           description: Identificador único del usuario.
 *           example: 609bda8f1c4ae34d5c8f9b2a
 *         name:
 *           type: string
 *           description: Nombre del usuario.
 *           example: Juan
 *         surname:
 *           type: string
 *           description: Apellido del usuario.
 *           example: Pérez
 *         username:
 *           type: string
 *           description: Nombre de usuario único.
 *           example: juanperez
 *         email:
 *           type: string
 *           description: Correo electrónico único.
 *           example: juan.perez@example.com
 *         password:
 *           type: string
 *           description: Contraseña del usuario (encriptada).
 *           example: $argon2id$v=19$m=4096,t=3,p=1$...
 *         profilePicture:
 *           type: string
 *           description: URL de la imagen de perfil del usuario.
 *           example: profile.jpg
 *         phone:
 *           type: string
 *           description: Número de teléfono del usuario.
 *           example: 12345678
 *         role:
 *           type: string
 *           description: Rol del usuario.
 *           enum:
 *             - USER_ROLE
 *             - ADMIN_ROLE
 *             - HOTEL_ADMIN_ROLE
 *           example: USER_ROLE
 *         status:
 *           type: boolean
 *           description: Estado del usuario (activo/inactivo).
 *           example: true
 */

const userSchema = new Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Name cannot exceed 25 characters"]
    },
    surname:{
        type: String,
        required: [true, "Surname is required"],
        maxLength: [25, "Surname cannot exceed 25 characters"]
    },
    username:{
        type: String,
        required: true,
        unique:true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },

    profilePicture:{
        type: String
    },
        
    phone:{
        type: String,
        minLength: 8,
        required: true
    },

    role:{
        type: String,
        required: true,
        enum: ['USER_ROLE', 'ADMIN_ROLE', 'HOTEL_ADMIN_ROLE'],
        default:'USER_ROLE'

    },
    status:{
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timeStamps: true
})

userSchema.methods.toJSON = function(){
    const {password, _id, ...usuario} = this.toObject()
    usuario.uid = _id
    return usuario
}

export default model("User", userSchema)