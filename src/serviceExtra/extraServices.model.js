import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     extraServices:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del servicio extra (MongoDB)
 *           example: "663c2e2f8e4b2a001f8e4b2b"
 *         name:
 *           type: string
 *           description: Nombre del servicio extra
 *           example: "Desayuno buffet"
 *         description:
 *           type: string
 *           description: Descripción del servicio extra
 *           example: "Acceso al desayuno buffet del hotel"
 *         cost:
 *           type: number
 *           format: float
 *           description: Costo del servicio extra (no puede ser negativo)
 *           example: 15.99
 *         hotel:
 *           type: string
 *           description: ID del hotel al que pertenece el servicio
 *           example: "663c2e2f8e4b2a001f8e4b2a"
 *         status:
 *           type: boolean
 *           description: Estado del servicio (activo/inactivo)
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del servicio
 *           example: "2024-05-14T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del servicio
 *           example: "2024-05-14T10:00:00.000Z"
 *       required:
 *         - name
 *         - description
 *         - cost
 *         - hotel
 */

const extraServicesSchema = new Schema({
    name: {
        type: String,
        required: [true, "Service name is required"]
    },
    description: {
        type: String,
        required: [true, "Service description is mandatory"]
    },
    cost: {
        type: Number,
        required: [true, "The cost of the service is mandatory"],
        min: [0, "The cost cannot be negative"]
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: [true, "Hotel reference is required"]
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model("extraServices", extraServicesSchema);