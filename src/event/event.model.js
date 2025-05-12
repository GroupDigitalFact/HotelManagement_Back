import mongoose from "mongoose";
const { Schema, model, models } = mongoose;/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único del evento.
 *           example: 609bda8f1c4ae34d5c8f9b2a
 *         nombre:
 *           type: string
 *           description: Nombre del evento.
 *           example: Conferencia de Negocios
 *         descripcion:
 *           type: string
 *           description: |
 *             Descripción detallada del evento. Puede incluir información sobre
 *             el propósito, los asistentes y otros detalles relevantes.
 *           example: Evento enfocado en estrategias de negocios para emprendedores.
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha del evento.
 *           example: 2025-05-15
 *         servicios:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de identificadores de servicios asociados al evento.
 *           example: ["609bda8f1c4ae34d5c8f9b2b", "609bda8f1c4ae34d5c8f9b2c"]
 *         hotel:
 *           type: string
 *           description: Identificador único del hotel al que pertenece el evento.
 *           example: 609bda8f1c4ae34d5c8f9b2d
 *         status:
 *           type: string
 *           description: Estado del evento (ACTIVO o CANCELADO).
 *           enum:
 *             - ACTIVO
 *             - CANCELADO
 *           example: ACTIVO
 */
const eventoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "Event name is required"]
    },
    descripcion: {
        type: String,
        required: [true, "Description is required"]
    },
    fecha: {
        type: Date,
        required: [true, "Event date is required"]
    },
    servicios: [{
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    }],

    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['ACTIVO', 'CANCELADO'],
        default: 'ACTIVO'
    }
}, {
    versionKey: false,
    timestamps: true
});

export default models.Event || model("Event", eventoSchema);
