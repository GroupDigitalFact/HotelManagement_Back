import { Schema, model } from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único de la reservación.
 *           example: 609bda8f1c4ae34d5c8f9b2a
 *         user:
 *           type: string
 *           description: Identificador único del usuario que realizó la reservación.
 *           example: 609bda8f1c4ae34d5c8f9b2b
 *         room:
 *           type: string
 *           description: Identificador único de la habitación reservada.
 *           example: 609bda8f1c4ae34d5c8f9b2c
 *         dateEntry:
 *           type: string
 *           format: date
 *           description: Fecha de entrada de la reservación.
 *           example: 2025-05-15
 *         departureDate:
 *           type: string
 *           format: date
 *           description: Fecha de salida de la reservación.
 *           example: 2025-05-20
 *         state:
 *           type: string
 *           description: Estado de la reservación (activa, finalizada, cancelada).
 *           enum:
 *             - activa
 *             - finalizada
 *             - cancelada
 *           example: activa
 *         extraServices:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de identificadores de servicios extra asociados a la reservación.
 *           example: ["609bda8f1c4ae34d5c8f9b2d", "609bda8f1c4ae34d5c8f9b2e"]
 *         cardNumber:
 *           type: string
 *           description: Número de tarjeta utilizado para la reservación.
 *           example: 1234567812345678
 *         CVV:
 *           type: string
 *           description: Código de seguridad de la tarjeta.
 *           example: 123
 *         expired:
 *           type: string
 *           format: date
 *           description: Fecha de expiración de la tarjeta.
 *           example: 2025-12-31
 */
const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    dateEntry: {
        type: Date,
        required: [true, "La fecha de entrada es obligatoria"]
    },
    departureDate: {
        type: Date,
        required: [true, "La fecha de salida es obligatoria"]
    },
    state: {
        type: String,
        enum: ['activa', 'finalizada', 'cancelada'],
        default: 'activa',
    },
    extraServices: [{
        type: Schema.Types.ObjectId,
        ref: 'extraServices',
    }],
    cardNumber: {
        type: String,
        required: [true, "Card Number is required"],
        minLength: [16, "The card cannot be less than 16 characters."]
    },
    CVV: {
        type: String,
        required: [true, "Card Number is required"],
        minLength: [3, "The card cannot be less than 16 characters."]
    },
    expired: {
        type: Date,
        required: [true, "Expiration date is required"]
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model("Reservation", reservationSchema);