import { Schema, model } from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único del hotel.
 *           example: 609bda8f1c4ae34d5c8f9b2a
 *         name:
 *           type: string
 *           description: Nombre del hotel.
 *           example: Hotel Paraíso
 *         address:
 *           type: string
 *           description: Dirección del hotel.
 *           example: Calle Principal #123, Ciudad
 *         qualification:
 *           type: string
 *           description: |
 *             Calificación del hotel. Valores permitidos:
 *             - 1 estrella
 *             - 2 estrellas
 *             - 3 estrellas
 *             - 4 estrellas
 *             - 5 estrellas
 *             - Boutique
 *             - Resort
 *             - Otro.
 *           example: 4 estrellas
 *         category:
 *           type: string
 *           description: |
 *             Categoría del hotel. Valores permitidos:
 *             - Económico
 *             - Estandar
 *             - Boutique
 *             - Lujoso.
 *           example: Boutique
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: Lista de servicios o comodidades ofrecidas por el hotel.
 *           example: ["WiFi", "Piscina", "Gimnasio"]
 *         admin:
 *           type: string
 *           description: Identificador único del administrador del hotel.
 *           example: 609bda8f1c4ae34d5c8f9b2b
 *         status:
 *           type: boolean
 *           description: Estado del hotel (activo o inactivo).
 *           example: true
 */
const hotelSchema = new Schema({
    name: {
        type: String,
        required: [true, "The hotel name is required"]
    },
    address: {
        type: String,
        required: [true, "Address is mandatory"]
    },
    qualification: {
        type: String,
        required: true,
        enum: ['1 estrella', '2 estrellas', '3 estrellas', '4 estrellas', '5 estrellas'],
        default: '3 estrellas',
        required: [true, "Qualification is required"]
    },
    category: {
        type: String,
        required: true,
        enum: ['Económico', 'Estandar', 'Boutique', 'Lujoso'],
        default: 'Estandar',
        required: [true, "Category is required"]
    },
    amenities: {
        type: [String], 
        default: []
    },

    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

export default model('Hotel', hotelSchema);