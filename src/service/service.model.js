import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único del servicio.
 *           example: 609bda8f1c4ae34d5c8f9b2a
 *         name:
 *           type: string
 *           description: Nombre del servicio.
 *           example: Servicio de lavandería
 *         description:
 *           type: string
 *           description: |
 *             Descripción detallada del servicio. Puede incluir información sobre
 *             lo que ofrece el servicio y sus características.
 *           example: Lavado y planchado de ropa con entrega en 24 horas.
 *         status:
 *           type: boolean
 *           description: Estado del servicio (activo o inactivo).
 *           example: true
 */

const serviceSchema = new Schema({
    name: {
        type: String,
        required: [true, "Service name is required"]
    },
    description: {
        type: String,
        required: [true, "Service description is mandatory"]
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model("Service", serviceSchema); 