import { Schema, model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único de la habitación.
 *           example: 609bda8f1c4ae34d5c8f9b2a
 *         tipo:
 *           type: string
 *           description: Tipo de habitación.
 *           enum:
 *             - simple
 *             - doble
 *             - suite
 *             - familiar
 *             - lujo
 *           example: suite
 *         capacidad:
 *           type: number
 *           description: Capacidad máxima de personas en la habitación.
 *           example: 4
 *         precio:
 *           type: number
 *           description: Precio por noche de la habitación.
 *           example: 150.75
 *         hotel:
 *           type: string
 *           description: Identificador único del hotel al que pertenece la habitación.
 *           example: 609bda8f1c4ae34d5c8f9b2b
 *         numeroCuarto:
 *           type: number
 *           description: Número de la habitación dentro del hotel.
 *           example: 101
 *         status:
 *           type: string
 *           description: Estado de la habitación (DISPONIBLE u OCUPADA).
 *           enum:
 *             - DISPONIBLE
 *             - OCUPADA
 *           example: DISPONIBLE
 */

const habitacionSchema = Schema({
    tipo: {
        type: String,
        required: true,
        enum: ['simple', 'doble', 'suite', 'familiar', 'lujo'],
        default: 'simple'
    },
    capacidad: {
        type: Number,
        required: true,
        min: [1, "Minimum capacity of 1 person"]
    },
    precio: {
        type: Number,
        required: true,
        min: [0, "The price cannot be negative"]
    },
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    numeroCuarto: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['OCUPADA', 'DISPONIBLE'],
        default: 'DISPONIBLE',
    },
}, {
    versionKey: false,
    timestamps: true
});

export default model('Room', habitacionSchema);